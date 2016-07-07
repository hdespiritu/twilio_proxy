var twil = require('./twilio_service');
var fs = require('fs');

function sendCalendar(options){
    return twil.sendAttachmentToPhone({
        phoneNumber: options.phoneNumber,
        plainText: options.plainText,
        attachment: null,//todo: undo. this is hardcoded later
        mimeType: "text/calendar"
    });
}

function generateCalendar(){
    return Promise.resolve(
`BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:Loan Payment Due
BEGIN:VEVENT
DTSTART:2016-05-01T00:00:00-05:00
DTEND:2016-08-01T00:00:00-05:00
SUMMARY:Loan Payment Due
DESCRIPTION:Please make sure to make the mininmum payment by the due date
RRULE:FREQ=MONTHLY;COUNT=3
END:VEVENT
END:VCALENDAR`);
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
};