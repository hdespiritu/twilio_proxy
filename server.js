"use strict";
var api = require('./api');

function main(){

    let sid = process.argv[2];
    let token = process.argv[3];
    let port = process.argv[4];

    //todo: verify that the port is actually open first
    //todo: unhardcode stuff
    api.createServer({
        sid: sid,
        token: token
    }).listen(port || 80);
}

//go!
main();