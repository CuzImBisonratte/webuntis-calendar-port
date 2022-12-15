const config = require('./config.json');
const WebUntis = require('webuntis');
const dav = require('dav');
const fs = require('fs');

// Add webuntis server url if needed
if (!config.webuntis.server.includes('.')) config.webuntis.server = config.webuntis.server + '.webuntis.com';

const untis = new WebUntis(config.webuntis.school, config.webuntis.username, config.webuntis.password, config.webuntis.server);

async function sendToCal() {
    var  xhr = new  dav.transport.Basic(new dav.Credentials({ username: config.caldav.username, password: config.caldav.password })); 
    dav.createAccount({ server: config.caldav.url, xhr: xhr, }).then(function(account)  {
        account.calendars.forEach(function(calendar) {
            if (calendar.displayName == config.caldav.calendar) {
                dav.createCalendarObject(calendar, {

                })
            }
        });
    });
}


sendToCal();
