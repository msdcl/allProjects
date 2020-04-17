const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = 'Asia/Calcutta'
let now = () => {
  return moment.utc().format()
}

let getLocalTime = () => {
  return moment().tz(timeZone).format()
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL')
}

let getEpoch = (time)=>{
  //var currentDate = new Date();

  var currentTime = time.getTime();
  
  //var localOffset = (-1) * currentDate.getTimezoneOffset() * 60000;
  
  return Math.round((currentTime)/ 1000);

  // let temp = new Date(time);
  // let date = new Date();
  // let offset =  date.getTimezoneOffset()
  // return temp.getTime()/1000.0;
}
let getTimeFromEpoch = (ts)=>{
  let myDate = new Date(ts * 1000)

    return myDate;
}
module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  getEpoch:getEpoch,
  getTimeFromEpoch:getTimeFromEpoch
}