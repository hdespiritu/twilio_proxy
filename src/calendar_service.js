var twil = require('./twilio_service');
var fs = require('fs');

function sendCalendar(options){
    return new Promise(function(resolve,reject){
        fs.readFile(process.cwd() + '/data/testCalAPI.ics', 'utf8',function(err,data){
            if(err){
                console.log(err);
            } 

           
            return resolve(data);
        });
    }).then(function(attachment){
        
        
        return Promise.resolve({
            phoneNumber: options.phoneNumber,
            plainText: options.plainText,
            attachment: attachment,
            mimeType: "calendar/text"
        });
    }).then(twil.sendAttachmentToPhone);
}

function generateCalendar(){
    
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
};