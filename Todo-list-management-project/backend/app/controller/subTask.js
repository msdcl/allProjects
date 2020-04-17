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
const SubTaskModel = mongoose.model('SubTask')

let addNewSubTask = (req, res) => {
   
    let addSubTask = () => {
        return new Promise((resolve, reject) => {
           
            SubTaskModel.findOne({ parentId: req.body.parentId ,subTask:req.body.subTask})
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'addNewSubTask:addSubTask', 10)
                        let apiResponse = response.generate(true, 'Failed To add sub task', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newTask = new SubTaskModel({
                            id: shortid.generate(),
                            parentId: req.body.parentId,
                            subTask : req.body.subTask,
                            isDone: false,   
                        })
                        newTask.save((err, newTask) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'addNewSubTask:addSubTask', 10)
                                let apiResponse = response.generate(true, 'Failed to create new sub task', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newTask.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('sub task already exists', 'addNewSubTask:addSubTask', 4)
                        let apiResponse = response.generate(true, 'sub task already exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


   addSubTask(req,res)
        .then((resolve) => {
            console.log(resolve)
            let apiResponse = response.generate(false, 'Task created', 200, resolve)
            res.send(apiResponse)
           // sock_session.sessions[apiResponse.data.userId].emit("newSubTaskCreated",apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            //sock_session.sessions[err.data.userId].emit("newTaskCreated",err);
        })
  
}

let getAllSubTaskOfTask = (req, res) => {

    SubTaskModel.find({ 'parentId': req.body.parentId }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting all sub task', 400, err)
            res.send(apiResponse)
        }else {
          //  res.send(result)
          console.log(result)
            let apiResponse = response.generate(false, 'All sub task in task', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteSubTaskFromList  = (req, res) => {
    SubTaskModel.findOneAndRemove({ 'id': req.body.id}, (err, result) => {
        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in delete sub task', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No sub task found')
            let apiResponse = response.generate(true, 'No sub task found', 400, result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'deletion successful', 200, result)
            res.send(apiResponse)

        }
    })
}

let updateSubTask = (req, res) => {

    let options = req.body;
    console.log(options);
    SubTaskModel.update({ 'id': req.body.id }, options, { multi: true }).exec((err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'updated sub task failed', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No sub task Found')
            let apiResponse = response.generate(true, 'sub task update failed', 400, result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'sub task updated', 200, result)
            res.send(apiResponse)

        }
    })
}
module.exports = {
    addNewSubTask :addNewSubTask ,
    getAllSubTaskOfTask :getAllSubTaskOfTask,
    deleteSubTaskFromList:deleteSubTaskFromList,
    updateSubTask :updateSubTask
}