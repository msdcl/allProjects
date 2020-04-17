const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib')
const sock_session = require('../libs/activeSockets')
/* Models */
const NotificationModel = mongoose.model('Notification')
const FriendsModel = mongoose.model('Friends')
const TextModel = mongoose.model('TextNotification')
// get all notifications of users 
let getPendingRequestsForUser = (req, res) => {
    
    let findNotifications = () => {
      return new Promise((resolve, reject) => {
       
  
        NotificationModel.find().or([ {'requestedBy': req.body.userId},{'requestedTo':req.body.userId}])
          .select('-_id -__v  -createdOn')
          .sort('-createdOn')
          .exec((err, result) => {
            if (err) {
              console.log(err)
              logger.error(err.message, 'friends Controller: getPendingRequestsForUser', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else {
              console.log('all notifications')
  
              // reversing array.
              let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    findNotifications(req,res)
      .then((result) => {
        let apiResponse = response.generate(false, 'all notification to user', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  }

// add new notification for a user
  let addNotification = (req, res) => {
    
    let addNew = () => {
      return new Promise((resolve, reject) => {
        let newUser = new NotificationModel({
            id: shortid.generate(),
            name: req.body.name,
            nameBy: req.body.nameBy,
            requestedTo: req.body.requestedTo,
            requestedBy: req.body.requestedBy,
            createdOn: time.now(),
        })
        newUser.save((err, newUser) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'friend: addNotification', 10)
                let apiResponse = response.generate(true, 'Failed to add new notification', 500, null)
                reject(apiResponse)
            } else {
                let newUserObj = newUser.toObject();
                resolve(newUserObj)
            }
        })

      })
    } // 
  
    let saveTextMessages = (result) => {
      return new Promise((resolve, reject) => {
             let data = {
               text : `${req.body.nameBy}-has sent you friend request`
             }
              let newText = new TextModel({
                  id: shortid.generate(),
                  userId: req.body.requestedTo,
                  text: `${req.body.nameBy}-has sent you friend request`,
                  isSeen: false,
                  date:time.now()
              })

              newText.save((err, newText) => {
                  if (err) {

                      console.log(err)
                      logger.error(err.message, 'addnotification:saveTextMessages', 10)
                      let apiResponse = response.generate(true, 'Failed to add friend request notification', 500, null)
                      reject(apiResponse)
                  } else {

                  }
              })
          
              if( sock_session.sessions[req.body.requestedTo]!=undefined){
                sock_session.sessions[req.body.requestedTo].emit("you-have-text-notification",data);
             }
          resolve(result)
      })
  }

    addNew(req,res)
      .then(saveTextMessages)
      .then((result) => {
        
        let apiResponse = response.generate(false, 'notification added', 200, result)
        res.send(apiResponse)
       
      })
      .catch((error) => {
        res.send(error)
      })
  }


  let addNewFriend = (req, res) => {
    
    let addNew = () => {
      return new Promise((resolve, reject) => {
        let newfriend = new FriendsModel({
            id: shortid.generate(),
            friendName: req.body.userName,
            friendId: req.body.userId,
            userId: req.body.friendId
            
        })
        newfriend.save((err, newfriend1) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'friends: addnewfriend', 10)
                let apiResponse = response.generate(true, 'Failed to add new friend', 500, null)
                reject(apiResponse)
            } else {
                let newUserObj = newfriend1.toObject();
               // resolve(newUserObj)
               
               
               let newfriend2 = new FriendsModel({
                id: shortid.generate(),
                friendName: req.body.friendName,
                friendId: req.body.friendId,
                userId: req.body.userId 
               })

               newfriend2.save((err, newfriend3) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'friends: addnewfriend', 10)
                    let apiResponse = response.generate(true, 'Failed to add new friend 2', 500, null)
                    reject(apiResponse)
                } else {
                 
                    resolve(newfriend3)
                }
            })
          }
        })

      })
    } // 
  
    let saveTextMessages = (result) => {
      return new Promise((resolve, reject) => {
               let data = {
                 text :`${req.body.userName}-has accepted your friend request`
               }
              let newText = new TextModel({
                  id: shortid.generate(),
                  userId: req.body.friendId,
                  text: `${req.body.userName}-has accepted your friend request`,
                  isSeen: false,
                  date:time.now()
              })

              newText.save((err, newText) => {
                  if (err) {

                      console.log(err)
                      logger.error(err.message, 'addnotification:saveTextMessages', 10)
                      let apiResponse = response.generate(true, 'Failed to add friend request notification', 500, null)
                      reject(apiResponse)
                  } else {

                  }
              })

              if( sock_session.sessions[req.body.friendId]!=undefined){
                sock_session.sessions[req.body.friendId].emit("you-have-text-notification",data);
             }
          
          resolve(result)
      })
  }

    let deleteEntryFromNotification  = () => {
      console.log("noti delete")
      return new Promise((resolve,reject)=>{
        NotificationModel.findOneAndRemove({'id':req.body.id}, (err, result) => {
          if (err) {
              console.log(err)
              let apiResponse = response.generate(true, 'error in delete task list', 400, err)
              reject(apiResponse)
          } else if (result == undefined || result == null || result == '') {
            console.log('No id found in notification ')
            let apiResponse = response.generate(true, 'No id found in notification', 400, result)
           reject(apiResponse)
        }else {
           
              let apiResponse = response.generate(false, 'deletion successful', 200, result)
              console.log(apiResponse)
            
             resolve(result)
  
          }
      })


      
      })
    
  }
    // making promise call.
    addNew(req,res)
    .then(saveTextMessages)
      .then(deleteEntryFromNotification)
      .then((result) => {
       
        let apiResponse = response.generate(false, 'add friend and delete notification', 200, result)
        res.send(apiResponse)
       
      })
      .catch((error) => {
        res.send(error)
      })
  }

  let getAllFriendsOfUser = (req, res) => {

    FriendsModel.find({ 'userId': req.body.userId }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting all friends', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No friend found')
            let apiResponse = response.generate(true, 'No friends', 400, result)
            res.send(apiResponse)
        }else {
          //  res.send(result)
            let apiResponse = response.generate(false, 'Friend list', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteUserFriend  = (req, res) => {
  FriendsModel.deleteMany({
    $or: [
        { $and: [{'userId':req.body.userId}, {'friendId':req.body.friendId}] },
        { $and: [{'userId':req.body.friendId}, {'friendId':req.body.userId}] }
    ]
}, (err, result) => {
      if (err) {
          console.log(err)
          let apiResponse = response.generate(true, 'error in deleting friend', 400, err)
          res.send(apiResponse)
      } else if (result == undefined || result == null || result == '') {
          console.log('No task found')
          let apiResponse = response.generate(true, 'No such friend', 400, result)
          res.send(apiResponse)
      } else {
          let apiResponse = response.generate(false, 'friend deletion successful', 200, result)
          res.send(apiResponse)

      }
  })
}

let updateUserNotificationList = (req, res) => {

  let data = JSON.parse(req.body.data);
 // console.log(data)
 
  let array=[];
  for(let x of data){
  
    array.push(x.id);
  }
 console.log(array)
  NotificationModel.update({ id: { $in: array } },
  { $set: { isSeen:true } },{'multi':true}).exec((err, result) => {

      if (err) {
          console.log(err)
          let apiResponse = response.generate(true, 'updated notification list failed', 400, err)
          res.send(apiResponse)
      } else if (result == undefined || result == null || result == '') {
          //console.log('No such task Found')
          console.log("no notification updated");
          let apiResponse = response.generate(true, 'notification updation failed', 400, result)
          res.send(apiResponse)
      } else {
        console.log("notification updated");
          let apiResponse = response.generate(false, 'notifications updated', 200, result)
          res.send(apiResponse)

      }
  })
}

  module.exports = {
    getPendingRequestsForUser:getPendingRequestsForUser,
    addNotification :addNotification,
    addNewFriend:addNewFriend,
    getAllFriendsOfUser :getAllFriendsOfUser,
    deleteUserFriend:deleteUserFriend,
    updateUserNotificationList:updateUserNotificationList
  }