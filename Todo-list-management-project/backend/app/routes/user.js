const express = require('express');
const router = express.Router();
const userController = require("./../../app/controller/user");
const appConfig = require("./../../config/config")
const allUsersController = require("./../../app/controller/allUsers");
module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion;

    // defining routes.
     

    

    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
   
   

    
    app.post(`${baseUrl}/login`, userController.loginFunction);
    
   

   
    app.post(`${baseUrl}/logout`, userController.logout);

    app.get(`${baseUrl}/getAllUsers`, allUsersController.getListOfAllUsers);
    app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);
    app.post(`${baseUrl}/changePassword`, userController.changePassword);
}
