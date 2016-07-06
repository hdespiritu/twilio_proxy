var twil = require('./twilio_service');
function sendCalendar(options){
     fs.readFile('../testCalAPI.ics', 'utf8',function(err,data){
        if(err){
            return console.log(err)
        } 
        var phoneNumber = options.phoneNumber;
        var text = options.plainText;
        var attachment = data;
        return twil.sendAttachmentToPhone(phoneNumber, text, attachment, 'calendar/text');
    });
}

function generateCalendar(){
    
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
}