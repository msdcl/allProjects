const cron = require('node-cron');
const dashboard = require('./../controllers/dashboard');
const time = require('./../libs/timeLib');
let scheduleTask=()=>{
    cron.schedule("*/1 * * * * *", function() {
        let temp = time.getEpoch(new Date())
     //   console.log(temp)
        dashboard.sendReminderOfMeeting(temp+60,temp);
      });
}

module.exports = {
    scheduleTask: scheduleTask
}