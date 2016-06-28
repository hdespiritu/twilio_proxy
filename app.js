var api = require('./api');

function main(){

    //todo: verify that the port is actually open first
    //todo: unhardcode stuff
    api.createServer({
        sid: process.argv[2],
        token: process.argv[3]
    }).listen(9009);
}

//go!
main();