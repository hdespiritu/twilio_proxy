"use strict";

var url = require('url');
var http = require('http');
var twil = require('./src/twilio_service');
var cal = require('./src/calendar_service');
var debug = require('./debug')({verbosity:1});

var actions = {
    "GET": {
        "get.test": testApi,
        "get.help": getHelp
    },

    "POST": {
        "post.sendText": twil.sendTextToPhone,
        "post.sendCalendar": cal.sendCalendar || function(options){
            var phoneNumber = options.phoneNumber;
            var text = options.plainText; //
            var calArgs = options.calArgs; //
            
            var attachment = cal.generateCalendar(calArgs);
            
            //must be a promise
            return twil.sendAttachmentToPhone(phoneNumber, text, attachment, 'calendar/text');
        }
    }
};

function httpHandler(request, response){

    request.shouldKeepAlive = false;

    let method = request.method;

    debug.log('BEGIN  ', method+' request '+request.url, request.connection.remoteAddress +' '+request.headers['user-agent']);

    if(actions.hasOwnProperty(method)) {

        let apiHit = url.parse(request.url, true);
        let pathPieces = apiHit.pathname.split('/');
        let actionName = pathPieces[pathPieces.length-1];

        if(actions[method].hasOwnProperty(actionName)){

            debug.log('DEV_001', actionName, request.connection.remoteAddress);

            if(method == 'GET') {

                actions[method][actionName](apiHit.query)
                    .then(function(result){
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.write(JSON.stringify(result));
                        response.end();

                    })
                    .catch(function(err){
                        debug.log('REQ_003', 'request fatal error', err);
                        response.writeHead(400, { 'Content-Type': 'application/json' });
                        response.write(JSON.stringify({
                            ok:false,
                            error: err
                        }));
                        response.end();
                    });
            }

            if(method == 'POST') {

                var jsonString = '';

                request.on('error', function(err){
                    debug.log('REQ_002', 'request fatal error', err);
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify({
                        ok: false,
                        error: err
                    }));
                    response.end();
                    request.forceTerminated = true;
                    request.connection.destroy();
                });

                request.on('data', function (data) {
                    jsonString += data;

                    if(jsonString.length > 5e6){//5MB
                        debug.log('BIG_001', 'request too large. rejecting.', jsonString.length);
                        jsonString = '';
                        response.writeHead(413, {'Content-Type': 'application/json'});
                        response.write(JSON.stringify({
                            ok: false,
                            error: "i shall not process this massive amount of garbage data"
                        }));
                        response.end();
                        request.forceTerminated = true;
                        request.connection.destroy();
                    }
                });

                request.on('end', function () {
                    if(!request.forceTerminated){

                        try{
                            var parsedObj = JSON.parse(jsonString);
                        }catch(err){
                            debug.log('HACK_001', 'someone passed in a bad json object', err);
                            response.writeHead(400, { 'Content-Type': 'application/json' });
                            response.write(JSON.stringify({
                                ok:false,
                                error: err.message
                            }));
                            response.end();
                            request.connection.destroy();
                        }

                        if(parsedObj){

                            try{
                                actions[method][actionName](parsedObj).then(function(report){
                                    report.ok = !report.error;
                                    response.writeHead(202, { 'Content-Type': 'application/json' });
                                    response.write(JSON.stringify(report));
                                    response.end();
                                });
                            }catch(err){
                                debug.log('HACK_004', 'someone called a method with bad data/args', err);
                                request.connection.destroy();
                            }
                        }
                    }
                });
            }

        }else{

            debug.log('HACK_002', 'someone called a bad function name.', actionName);
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({
                ok: false,
                error: `${actionName || 'null'} is not a ${method} method`,
                methods: buildMethodList()
            }));
            response.end();
        }

    }else{

        debug.log('HACK_003', 'someone requested an unsupported action type', method);
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({
            ok: false,
            error: `${method} is not a supported request type`,
            supportedRequestTypes: Object.getOwnPropertyNames(actions)
        }));

        response.end();
    }

}

function testApi() {
    return Promise.resolve({
        ok: true
    });
}

function getHelp() {
    return Promise.resolve({
        ok: true,
        methods: buildMethodList()
    });
}

function buildMethodList(){
    return Object.getOwnPropertyNames(actions.GET)
        .concat(Object.getOwnPropertyNames(actions.POST));
}

function createServer(options){

    if(!options)
        throw "you need to init the twilio service before starting the http server";

    twil.configure(options);
    return http.createServer(httpHandler);
}

module.exports = {
    createServer: createServer
};