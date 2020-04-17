
const express = require('express');
const router = express.Router();

const appConfig = require("./../../config/config")
const taskController = require("./../../app/controller/taskList");
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion;
  app.post(`${baseUrl}/addNewTask`, taskController.addNewTask);
  app.post(`${baseUrl}/getAllTask`, taskController.getTaskFromList);
  app.post(`${baseUrl}/deleteTaskFromList`, taskController.deleteTaskFromList);
  app.post(`${baseUrl}/updateTaskFromList`, taskController.updateTask);
  app.post(`${baseUrl}/addNewTodoList`, taskController.addNewEmptyList);
  app.post(`${baseUrl}/getAllTodoList`, taskController.getAllTodoLists);
  app.post(`${baseUrl}/deleteTodoList`, taskController.deleteTodoList);
}