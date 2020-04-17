const express = require('express');
const router = express.Router();

const appConfig = require("./../../config/config")
const subTaskController = require("./../../app/controller/subTask");
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion;
  
 app.post(`${baseUrl}/updateSubTaskStatus`, subTaskController.updateSubTask);
  app.post(`${baseUrl}/addNewSubTask`, subTaskController.addNewSubTask);
  app.post(`${baseUrl}/getAllSubTasks`, subTaskController.getAllSubTaskOfTask);
  app.post(`${baseUrl}/deleteSubTask`, subTaskController.deleteSubTaskFromList);
}