const express = require('express');
const router = express.Router();

const appConfig = require("./../../config/config")
const friendController = require("./../../app/controller/friends");
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion;
  
// app.post(`${baseUrl}/updateSubTaskStatus`, subTaskController.updateSubTask);
  app.post(`${baseUrl}/addNotification`, friendController.addNotification);
  app.post(`${baseUrl}/getAllNotification`, friendController.getPendingRequestsForUser);
  app.post(`${baseUrl}/friendRequestAccepted`, friendController.addNewFriend);
//  app.post(`${baseUrl}/deleteSubTask`, subTaskController.deleteSubTaskFromList);
app.post(`${baseUrl}/getAllFriends`, friendController.getAllFriendsOfUser);
app.post(`${baseUrl}/deleteUserFriend`, friendController.deleteUserFriend);

app.post(`${baseUrl}/updateUserNotificationList`, friendController.updateUserNotificationList);

}