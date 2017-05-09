var db = [];
var CronJob = require('cron').CronJob;
var moment = require('moment');
var twilio = require('twilio');

var cfg = {};
cfg.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
cfg.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

var cronjob = new CronJob('00 00 06 * * *', function() {
// var cronjob = new CronJob('* * * * * *', function() {
        console.log('Running Send Notifications Worker for ' +  moment().format());
        run();
    }, null, true, '');

function add(obj)
{
    db.push(obj);
}

/**
 * This function returns -1 if date is less than current date.
 * 0 if it is after tomorrow
 * 1 if it is tomorrow
 * @param {date of the exam} date 
 */
function requires_notification(date)
{
    var current_date = moment(Date.now()).tz('Asia/Calcutta');
    var exam_date = moment(date).tz('Asia/Calcutta');
    if(current_date.isBefore(exam_date,"day"))
    {
        if(current_date.add(1,"day").isSame(exam_date,"day"))
        {
            return 1;
        }
        return 0;
    }
    return -1;
}

function run()
{
    console.log("run");
    var new_db = [];
    var today_messages = [];
    var len = db.length;
    for( var i=0; i < len; i++)
    {
        var res = requires_notification(db[i].examDate);
        if(res == 0)
        {
            new_db.push(db[i]);
        }
        else if(res == 1)
        {
            today_messages.push(db[i]);
        }
    }
    send_notifications(today_messages);
    db = new_db;
}

function send_notifications(messages)
{
    var client = new twilio.RestClient(cfg.twilioAccountSid, cfg.twilioAuthToken);
    messages.forEach( function(student) {
        var dt = student.examDate.toLocaleDateString('en-US',{weekday: "short", day: "2-digit", month: "short",timeZone: "Asia/Kolkata"});
        var options = {
                to: student.phoneNumber,
                from: cfg.twilioPhoneNumber,
                body: "Hi " + student.name + ".\nJust a reminder that you have "+student.exam+" coming up on " + dt +".\nBest of Luck!\n -- CampusBot"
            };
        console.log(options);
        client.sendMessage(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    var masked = student.phoneNumber.substr(0,
                        student.phoneNumber.length - 5);
                    masked += '*****';
                    console.log('Message sent to ' + masked);
                }
            });
    });
}
module.exports = {
    "job": cronjob,
    "db" : db,
    "add": add
};
