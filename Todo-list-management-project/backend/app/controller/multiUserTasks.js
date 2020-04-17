const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')

const sock_session = require('../libs/activeSockets')
/* Models */

const listModel = mongoose.model('MultiToDoList')
const TaskModel = mongoose.model('TaskModel')
const TextModel = mongoose.model('TextNotification')
let addNewTask = (req, res) => {

    let getListOfSharedusers = (req, res) => {
        return new Promise((resolve, reject) => {
            listModel.findOne({ listName: req.body.listName, 'sharedWith': req.body.userId }, (err, userDetails) => {
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'multiUserTasks Controller: addNewTask', 10)
                    let apiResponse = response.generate(true, 'Failed To Find User Details from shared list', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No such user exists', 'multiUserTasks Controller: addNewTask', 10)
                    let apiResponse = response.generate(true, 'You cannot add task', 500, null)
                    reject(apiResponse)
                } else {

                    resolve(userDetails)
                }
            })
        })
    }
    let addNew = (userDetails) => {
        return new Promise((resolve, reject) => {

            TaskModel.findOne({ listName: req.body.listName, taskName: req.body.taskName })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'multiUserTask:addNewTask', 10)
                        let apiResponse = response.generate(true, 'Failed To add new task', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newList = new TaskModel({
                            id: shortid.generate(),
                            listName: req.body.listName,
                            taskName: req.body.taskName,
                            isDone: false
                            
                        })
                        newList.save((err, newTask) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'multiUserTask:addNewTask', 10)
                                let apiResponse = response.generate(true, 'Failed to create new task', 500, null)
                                reject(apiResponse)
                            } else {
                                console.log(userDetails)

                                let newUserObj = newTask.toObject();
                                let data = {
                                    user: userDetails,
                                    obj: newUserObj
                                }
                                resolve(data)
                            }
                        })
                    } else {

                        logger.error('this list already exists', 'multiUserTask:addNewTask', 4)
                        let apiResponse = response.generate(true, 'this task already exists----', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    let saveTextMessages = (details) => {
        return new Promise((resolve, reject) => {
            let sharedWith = details.user.sharedWith
            for (let x in sharedWith) {

                if (sock_session.sessions[sharedWith[x]] != undefined && sharedWith[x] != req.body.userId) {
                    let data = {
                        add: true,
                        text: `New task- ${req.body.taskName} is added to ${req.body.listName} by ${req.body.userName}`,
                        result: details.obj
                    }
                    sock_session.sessions[sharedWith[x]].emit("you-have-text-notification-list-modified", data);
                }
            }
            for (let x = 0; x < sharedWith.length; x++) {

                let newText = new TextModel({
                    id: shortid.generate(),
                    userId: sharedWith[x],
                    text: `New task- ${req.body.taskName} is added to ${req.body.listName} by ${req.body.userName}`,
                    isSeen: false,
                    date:time.now()
                })

                newText.save((err, newText) => {
                    if (err) {

                        console.log(err)
                        logger.error(err.message, 'multiUserTasks:saveTextMessages', 10)
                        let apiResponse = response.generate(true, 'Failed to add text notification', 500, null)
                        reject(apiResponse)
                    } else {

                    }
                })
            }
            resolve(details.obj)
        })
    }


    getListOfSharedusers(req, res)
        .then(addNew)
        .then(saveTextMessages)
        .then((resolve) => {

            let apiResponse = response.generate(false, 'new task created in multi user list', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            
        })


}
let getAllTaskOfMultiUserList = (req, res) => {
    TaskModel.find({ 'listName': req.body.listName }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting tasks of multiuser list', 400, err)
            res.send(apiResponse)
        } else {
            console.log(result)
            let apiResponse = response.generate(false, 'All tasks of multi user list', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteTaskFromMultiUserList = (req, res) => {



    let saveTextMessages = (result) => {
        return new Promise((resolve, reject) => {
            let sharedWith = JSON.parse(req.body.sharedWith)
            for (let x in sharedWith) {

                if (sock_session.sessions[sharedWith[x]] != undefined && sharedWith[x] != req.body.userId) {
                    let data = {
                        delete: true,
                        text: `Task- ${req.body.taskName} -is deleted from ${req.body.listName} by ${req.body.userName}`,
                        result: req.body.id
                    }
                    sock_session.sessions[sharedWith[x]].emit("you-have-text-notification-list-modified", data);
                }
            }
            for (let x = 0; x < sharedWith.length; x++) {

                let newText = new TextModel({
                    id: shortid.generate(),
                    userId: sharedWith[x],
                    text: `Task- ${req.body.taskName} -is deleted from ${req.body.listName} by ${req.body.userName}`,
                    isSeen: false,
                    date:time.now()
                })

                newText.save((err, newText) => {
                    if (err) {

                        console.log(err)
                        logger.error(err.message, 'multiUserTasks:saveTextMessages', 10)
                        let apiResponse = response.generate(true, 'Failed to add text notification', 500, null)
                        reject(apiResponse)
                    } else {

                    }
                })
            }
            resolve(result)
        })
    }
    let deletetask = (req, res) => {
        return new Promise((resolve, reject) => {
            TaskModel.findOneAndRemove({ 'id': req.body.id }, (err, result) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'error in delete task from multi user list', 400, err)
                    reject(apiResponse)
                } else if (result == undefined || result == null || result == '') {
                    console.log('No task found')
                    let apiResponse = response.generate(true, 'No such task in multi user todo list', 400, result)
                    reject(apiResponse)
                } else {
                    // let apiResponse = response.generate(false, 'deletion successful-task', 200, result)
                    //  res.send(apiResponse)
                    resolve(result)
                }
            })
        })
    }

    deletetask(req, res)
        .then(saveTextMessages)
        .then((resolve) => {

            let apiResponse = response.generate(false, 'deletion successful-task-multiuser', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            //sock_session.sessions[err.data.userId].emit("newTaskCreated",err);
        })
}


let updateTaskOfMultiUserList = (req, res) => {

    let updateTask = (req, res) => {
        return new Promise((resolve, reject) => {
            let options = req.body;
            console.log(options);
            TaskModel.update({ 'id': req.body.id }, options, { multi: true }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'updated text notification failed', 400, err)
                    reject(apiResponse)
                } else {
                    // let apiResponse = response.generate(false, 'text notification updated', 200, result)
                    resolve(result)

                }
            })
        })
    }


    let saveTextMessages = (result) => {
        return new Promise((resolve, reject) => {
            let textMessage;
            if (req.body.type == "editName") {
                textMessage = `Task- ${req.body.oldName} of ${req.body.listName} is modified to- ${req.body.taskName} by ${req.body.userName}`
            } else if (req.body.type === "check") {
                if(req.body.isDone=="true"){
                    textMessage = `Task- ${req.body.taskName} of ${req.body.listName} is marked as done by ${req.body.userName}`
                  } else {
                    textMessage = `Task- ${req.body.taskName} of ${req.body.listName} is marked as incomplete by ${req.body.userName}`
                }

            }


            let sharedWith = JSON.parse(req.body.sharedWith)
            for (let x in sharedWith) {

                if (sock_session.sessions[sharedWith[x]] != undefined && sharedWith[x] != req.body.userId) {
                    let data = {
                        update: true,
                        text: textMessage,
                        result: req.body
                    }
                    sock_session.sessions[sharedWith[x]].emit("you-have-text-notification-list-modified", data);
                }
            }
            for (let x = 0; x < sharedWith.length; x++) {

                let newText = new TextModel({
                    id: shortid.generate(),
                    userId: sharedWith[x],
                    text: textMessage,
                    isSeen: false,
                    date:time.now()

                })

                newText.save((err, newText) => {
                    if (err) {

                        console.log(err)
                        logger.error(err.message, 'multiUserTasks:saveTextMessages', 10)
                        let apiResponse = response.generate(true, 'Failed to add text notification', 500, null)
                        reject(apiResponse)
                    } else {

                    }
                })
            }
            resolve(result)
        })
    }

    updateTask(req, res)
        .then(saveTextMessages)
        .then((resolve) => {

            let apiResponse = response.generate(false, 'Edition successful-task-multiuser', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            //sock_session.sessions[err.data.userId].emit("newTaskCreated",err);
        })

}

module.exports = {
    addNewTask: addNewTask,
    getAllTaskOfMultiUserList: getAllTaskOfMultiUserList,
    deleteTaskFromMultiUserList: deleteTaskFromMultiUserList,
    updateTaskOfMultiUserList: updateTaskOfMultiUserList
}