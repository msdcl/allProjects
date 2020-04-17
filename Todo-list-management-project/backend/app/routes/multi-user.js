const express = require('express');
const router = express.Router();

const appConfig = require("./../../config/config")
const multiController = require("./../../app/controller/multiTaskList");
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion;
  
 app.post(`${baseUrl}/shareTodoListWithFriend`, multiController.shareTodoListWithFriend);
  app.post(`${baseUrl}/addNewMultiUserTodoList`,multiController.addNewEmptyList);
  app.post(`${baseUrl}/getAllMultiUserTodoLists`, multiController.getAllTodoLists);
  app.post(`${baseUrl}/allfriendsToListShared`, multiController.friendsToListShared);
  app.post(`${baseUrl}/removeFriendFromSharedList`, multiController.removeFriendFromSharedList);
  app.post(`${baseUrl}/getAllTextNotification`, multiController.getAllTextNotification);
  app.post(`${baseUrl}/updateTextNotification`, multiController.updateTextNotification);
  app.post(`${baseUrl}/deleteMultiUserList`, multiController.deleteMultiUserList);
}