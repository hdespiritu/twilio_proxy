"use strict";
var fs = require('fs');

const sep = {
        linux: '/',
        win32: '\\\\',
        win64: '\\\\'
    }[process.platform] || '/';

var defaults = {
    verbosity: 1, //todo: verbosity on init. flags?
    fileName: `${process.cwd()}${sep}api.log`
};

//todo: return self and configure return self. cleaner
module.exports = function(options){

    options.verbosity = options.verbosity || defaults.verbosity;
    options.fileName = options.fileName || defaults.fileName;

    return {
        log: function (title, text, extra) {
            //todo: add verbosity later and keep title character length to 7 at all times. pad if short and substring if long
            let logLine = `${(new Date).toISOString()} | ${title} | ${text} | (${extra || ''})`;

            console.log(logLine);

            fs.appendFile(options.fileName, logLine+'\n', function (err) {
                if(err){
                    console.error('Fatal Error writing to log file!');
                    console.error(err);
                    return false;

                }else{
                    return true;}
            });
        }
    };
};