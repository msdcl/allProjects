const express = require('express');
const router = express.Router();

const appConfig = require("./../../config/config")
const multiUserController = require("./../../app/controller/multiUserTasks");
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion;
  
 
  app.post(`${baseUrl}/addTaskToMultiUserList`,multiUserController.addNewTask);
  app.post(`${baseUrl}/getAllTasksOfMultiUserList`, multiUserController.getAllTaskOfMultiUserList);
  app.post(`${baseUrl}/deleteTasksOfMultiUserList`, multiUserController.deleteTaskFromMultiUserList);
   
  app.post(`${baseUrl}/updateTaskOfMultiUserList`, multiUserController.updateTaskOfMultiUserList);
}