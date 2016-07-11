var twil = require('./twilio_service');
var fs = require('fs');

function sendCalendar(options){
    return twil.sendAttachmentToPhone({
        phoneNumber: options.phoneNumber,
        plainText: options.plainText,
        attachment: null,//todo: undo. this is hardcoded later
        mimeType: "application/octet-stream"
    });
}

function generateCalendar(){
    return Promise.resolve(
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//www.marudot.com//iCal Event Maker
X-WR-CALNAME:You Must Die, I alone am best
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:America/Chicago
TZURL:http://tzurl.org/zoneinfo-outlook/America/Chicago
X-LIC-LOCATION:America/Chicago
BEGIN:DAYLIGHT
TZOFFSETFROM:-0600
TZOFFSETTO:-0500
TZNAME:CDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0500
TZOFFSETTO:-0600
TZNAME:CST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:20160711T151351Z
UID:20160711T151351Z-1814852374@marudot.com
DTSTART;TZID="America/Chicago":20160712T120000
DTEND;TZID="America/Chicago":20160712T120000
SUMMARY:good city
DESCRIPTION:sdfasdfadf
END:VEVENT
END:VCALENDAR
Add Comment`);
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
};