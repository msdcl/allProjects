const mongoose = require('mongoose');
const shortid = require('shortid');

const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const email = require('../libs/sendEmails')
const time = require('../libs/timeLib')
const token = require('../libs/tokenLib')
const check = require('../libs/checkLib')
const sock_session = require('../libs/activeSockets')
const UserModel = mongoose.model('User')
const MeetingModel = mongoose.model('Meeting')

const NotiModel = mongoose.model('Notification')
// get all normal users on this platform
let getAllNormalUsers = (req, res) => {

    UserModel.find({ 'isAdmin': false }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting normal users', 400, err)
            res.send(apiResponse)
        } else {

            for (let i = 0; i < result.length; i++) {
                let temp = result[i].toObject();

                delete temp.password
                delete temp._id
                delete temp.__v
                delete temp.createdOn
                delete temp.modifiedOn
                delete temp.tokens
                delete temp.countryCode
                delete temp.mobileNumber

                result[i] = temp;
            }
            let apiResponse = response.generate(false, 'All normal users', 200, result)
            res.send(apiResponse)
        }
    })
}

// create new meeting by admin
let addMeeting = (req, res) => {


    let decodeToken = (req, res) => {
        return new Promise((resolve, reject) => {
            token.verifyToken(req.header('authToken'), (err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'invalid token', 400, null)
                    res.send(apiResponse)
                } else {
                    resolve(result);
                }
            })
        })
    }

    let newMeeting = (adminDetails) => {
        return new Promise((resolve, reject) => {
            // let startTime = time.getEpoch(req.body.startTime);

            // let endTime = time.getEpoch(req.body.endTime);
            //  console.log(startTime)
            //  console.log(endTime)

            let newMeeting = new MeetingModel({
                id: shortid.generate(),
                userId: req.body.userId,
                createdBy: adminDetails.data.userName,
                startTime:req.body.startTime,
                endTime: req.body.endTime,
                name: req.body.name,
                description: req.body.description,
                userEmail:req.body.userEmail,
                lastNotification:time.now()
            })

            newMeeting.save((err, meeting) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'dashboard: newMeeting', 10)
                    let apiResponse = response.generate(true, 'Failed to add new meeting', 500, null)
                    reject(apiResponse)
                } else {
                    //  let newUserObj = newUser.toObject();
                    resolve(meeting)
                }
            })
        })
    }

    let sendEmail = (meeting) => {
        return new Promise((resolve, reject) => {
            email.meetingCreationEmail(meeting, req.body.userEmail)
                    resolve(meeting);
            

        })

    }
    let sendAlert = (meeting) => {
        return new Promise((resolve, reject) => {
            let newMeeting = new NotiModel({
                id: shortid.generate(),
                userId: req.body.userId,
                text: `New meeting- '${meeting.name}'-has been created`,
                isSeen:false,
                date:time.now()
                
            })
            newMeeting.save((err, meetingText) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'dashboard: sendAlert', 10)
                    let apiResponse = response.generate(true, 'Failed to add notification for meeting', 500, null)
                    reject(apiResponse)
                } else {
                    let data = {
                        text:`New meeting- '${meeting.name}'-has been created`,
                        meetingInfo:meeting,
                        add:true
                    }
                    if (sock_session.sessions[req.body.userId] != undefined) {
                        sock_session.sessions[req.body.userId].emit("meeting-info", data);
                    }
                    resolve(meeting)
                }
            })
           
        })
    }
    decodeToken(req, res)
        .then(newMeeting)
        .then(sendEmail)
        .then(sendAlert)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'meeting created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}

let updateMeeting = (req, res) => {

    let doUpdate = (req, res) => {
        return new Promise((resolve, reject) => {
           console.log(req.body)
            if(check.isEmpty(req.body.startTime)){
               
                delete req.body.startTime
            }
            
            if(check.isEmpty(req.body.endTime)){
                delete req.body.endTime
            }
           
            if(check.isEmpty(req.body.description)){
                delete req.body.description
            }
            if(check.isEmpty(req.body.name)){
                delete req.body.name
            }
            let update = req.body;
            let query = { 'id': req.body.id };
            let options = { new: true }
            MeetingModel.findOneAndUpdate(query, update, options, (err, result) => {

                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'update meeting failed', 400, err)
                    reject(apiResponse)
                } else {
                    // let apiResponse = response.generate(false, 'meeting updated', 200, result)
                  
                    resolve(result)
                }
            })
        })
    }

    let sendEmail = (result) => {
        return new Promise((resolve, reject) => {
            email.meetingUpdatedEmail(result, result.userEmail)
                    resolve(result);
                

        })

    }
    let sendAlert = (result) => {
        return new Promise((resolve, reject) => {

            let updateMeeting = new NotiModel({
                id: shortid.generate(),
                userId: result.userId,
                text: `Meeting- '${result.name}'-has been updated`,
                isSeen:false,
                date:time.now()
                
            })
            updateMeeting.save((err, meetingText) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'dashboard: sendAlert-update', 10)
                    let apiResponse = response.generate(true, 'Failed to add notification for meeting', 500, null)
                    reject(apiResponse)
                } else {
                    let data = {
                        text:`Meeting- '${result.name}'-has been updated`,
                        meetingInfo:result,
                        update:true
                    }
                 
                    if (sock_session.sessions[result.userId] != undefined) {
                      
                        sock_session.sessions[result.userId].emit("meeting-info", data);
                    }
                    resolve(result)
                }
            })
           
        })
    }

    doUpdate(req, res)
        .then(sendEmail)
        .then(sendAlert)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'meeting updated', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}

let deleteMeeting = (req, res) => {
    
    MeetingModel.findOneAndRemove({ 'id': req.body.id }, (err, result) => {
        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in delete meeting', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No meeting found')
            let apiResponse = response.generate(true, 'No such meeting found', 400, result)
            res.send(apiResponse)
        } else {
            email.meetingCancelledEmail(result)


            let deleteMeeting = new NotiModel({
                id: shortid.generate(),
                userId: result.userId,
                text: `Meeting- '${result.name}'-has been cancelled`,
                isSeen:false,
                date:time.now()
                
            })
            deleteMeeting.save((err, meetingText) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'dashboard: sendAlert-delete', 10)
                    let apiResponse = response.generate(true, 'Failed to add notification for meeting', 500, null)
                    res.send(apiResponse)
                } else {
                    let data = {
                        text:`Meeting- '${result.name}'-has been cancelled`,
                        meetingInfo:result,
                        delete:true
                    }
                 
                    if (sock_session.sessions[result.userId] != undefined) {
                      
                        sock_session.sessions[result.userId].emit("meeting-info", data);
                    }
            
                }
            })

            let apiResponse = response.generate(false, 'meeting deletion successful', 200, result)
            res.send(apiResponse)

        }
    })
}

let getAllMeetings = (req, res) => {

    let startTime = req.body.startTime;

    let endTime = req.body.endTime;
    MeetingModel.find({ 
          $or: [
            { $and:[{'userId':req.body.userId}, {'startTime':{$gte:startTime}},{'startTime':{$lte:endTime}}] },
            { $and:[{'userId':req.body.userId}, {'endTime':{$gte:startTime}},{'endTime':{$lte:endTime}}] },
            { $and:[{'userId':req.body.userId}, {'startTime':{$lt:startTime}},{'endTime':{$gt:endTime}}] }
        ]
     }, 
    
        (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting meeting', 400, err)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All meetings', 200, result)
            res.send(apiResponse)
        }
    })
}

//this function will be call when 1 min is left for meeting start
let sendReminderOfMeeting = (estimatedStartTime,estimatedEndTime)=>{

    MeetingModel.find({
        $or: [
            { 'startTime':estimatedStartTime },
            { $and: [{'isSnoozed':true}, {'isDismissed': false},{'endTime':{$gt: estimatedEndTime}},{'lastNotification': estimatedEndTime-5}] }
        ]
    }, (err, result) => {

        if (err) {
            logger.error(err, 'dashboard: sendReminderOfMeeting', 10)
            let apiResponse = response.generate(true, 'error in getting meeting to send reminders', 400, err)
            res.send(apiResponse)
        } else {
        
           for(let i=0;i<result.length;i++){
               
               console.log(result[i].name)
               updateMeetingInternally(result[i]);
               addNotificationOfReminder(result[i])
            if (sock_session.sessions[result[i].userId] != undefined) {
                let data = {
                    reminder:true,
                    meetingInfo:result[i],
                    text:`Reminder for meeting ${result[i].name}`
                }
                sock_session.sessions[result[i].userId].emit("meeting-info",data);
            }
             email.meetingReminderEmail(result[i])
            
           }

        }
    })
}

let addNotificationOfReminder = (result)=>{
    let updateMeeting = new NotiModel({
        id: shortid.generate(),
        userId: result.userId,
        text: `Reminder for '${result.name}'`,
        isSeen:false,
        date:time.now()
        
    })
    updateMeeting.save((err, meetingText) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'dashboard: addNotificationOfReminder-reminder', 10)
           
        } 
    })
}
let getAllTextNotifications = (req, res) => {

   
    NotiModel.find({ 'userId': req.body.userId }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting notifications', 400, err)
            res.send(apiResponse)
        } else {
           // console.log(result)
            let apiResponse = response.generate(false, 'All notifications', 200, result)
            res.send(apiResponse)
        }
    })
}

let marknotificationAsSeen = (req,res)=>{
    let update = req.body;
   
    let query = { 'userId': req.body.userId };
    let options = { new: true }
  
    NotiModel.update({ 'userId': req.body.userId }, update, { multi: true }).exec((err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, ' notification mark as seen failed', 400, err)
            res.send(apiResponse)
        }  else {
          //  console.log(result)
            let apiResponse = response.generate(false, 'notification seen', 200, result)
            res.send(apiResponse)

        }
    })
}

let updateMeetingInternally = (result)=>{
    let update = {'isSnoozed':false};
    let query = { 'id': result.id };
    let options = { new: true }
    MeetingModel.findOneAndUpdate(query, {$set: {'isSnoozed':false}}, options, (err, result) => {

        if (err) {
            console.log(err)
            console.log("error while updating once snoozed")
        }
    })
}

let updateSnoozedAndDismissed = (req,res)=>{
    req.body.lastNotification= time.getEpoch(new Date());
    let update = req.body;
    let query = { 'id': req.body.id };
    let options = { new: true }
    MeetingModel.findOneAndUpdate(query, update, options, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'update snoozed meeting failed', 400, err)
            res.send(apiResponse)
        } else {
           // console.log(result);
             let apiResponse = response.generate(false, 'snooze meeting updated', 200, result)
            res.send(apiResponse)
        }
    })
}
module.exports = {
    getAllNormalUsers: getAllNormalUsers,
    addMeeting: addMeeting,
    updateMeeting: updateMeeting,
    deleteMeeting: deleteMeeting,
    getAllMeetings: getAllMeetings,
    sendReminderOfMeeting:sendReminderOfMeeting,
    getAllTextNotifications:getAllTextNotifications,
    marknotificationAsSeen:marknotificationAsSeen,
    updateSnoozedAndDismissed:updateSnoozedAndDismissed
}