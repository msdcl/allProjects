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
const TaskModel = mongoose.model('Task')
const TodoListModel = mongoose.model('TodoList')

let addNewTask = (req, res) => {
   

   
    let addTask = () => {
        return new Promise((resolve, reject) => {
           
            TaskModel.findOne({ userId: req.body.userId ,listName:req.body.listName, taskName :req.body.taskName})
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'taskList:addTask', 10)
                        let apiResponse = response.generate(true, 'Failed To add task', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newTask = new TaskModel({
                            id: shortid.generate(),
                            userId: req.body.userId,
                            listName : req.body.listName,
                            taskName: req.body.taskName,
                            isDone: false,   
                        })
                        newTask.save((err, newTask) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'taskList: addTask', 10)
                                let apiResponse = response.generate(true, 'Failed to create new task', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newTask.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('task already exists', 'taskList: addTask', 4)
                        let apiResponse = response.generate(true, 'task already exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


   addTask(req,res)
        .then((resolve) => {
            console.log(resolve)
            let apiResponse = response.generate(false, 'Task created', 200, resolve)
            res.send(apiResponse)
            sock_session.sessions[apiResponse.data.userId].emit("newTaskCreated",apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            //sock_session.sessions[err.data.userId].emit("newTaskCreated",err);
        })
  

}// add new task end


let getTaskFromList = (req, res) => {

    TaskModel.find({ 'userId': req.body.userId,'listName':req.body.listName }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting task list', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No task found')
            let apiResponse = response.generate(true, 'No task in list', 400, result)
            res.send(apiResponse)
        }else {
          //  res.send(result)
            let apiResponse = response.generate(false, 'All task of a list', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteTaskFromList  = (req, res) => {
    TaskModel.findOneAndRemove({ 'id': req.body.id}, (err, result) => {
        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in delete task list', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No task found')
            let apiResponse = response.generate(true, 'No such task found', 400, result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'deletion successful', 200, result)
            res.send(apiResponse)

        }
    })
}

let updateTask = (req, res) => {

    let options = req.body;
    console.log(options);
    TaskModel.update({ 'id': req.body.id }, options, { multi: true }).exec((err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'updated task failed', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No such task Found')
            let apiResponse = response.generate(true, 'task update failed', 400, result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'task updated', 200, result)
            res.send(apiResponse)

        }
    })
}


let addNewEmptyList = (req, res) => {
   
    let addEmptyList = () => {
        return new Promise((resolve, reject) => {
           
            TodoListModel.findOne({ userId: req.body.userId ,listName:req.body.listName})
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'addNewEmptyList:addEmptyList', 10)
                        let apiResponse = response.generate(true, 'Failed To add empty list', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newList = new TodoListModel({
                            id: shortid.generate(),
                            userId: req.body.userId,
                            listName : req.body.listName  
                        })
                        newList.save((err, newTask) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'addNewEmptyList:addEmptyList', 10)
                                let apiResponse = response.generate(true, 'Failed to create new empty list', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newTask.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('this list already exists', 'addNewEmptyList:addEmptyList', 4)
                        let apiResponse = response.generate(true, 'this list already exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    addEmptyList(req,res)
        .then((resolve) => {
            console.log(resolve)
            let apiResponse = response.generate(false, 'new empty list created', 200, resolve)
            res.send(apiResponse)
            sock_session.sessions[apiResponse.data.userId].emit("newEmptyListCreated",apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
            //sock_session.sessions[err.data.userId].emit("newTaskCreated",err);
        })
  

}


let getAllTodoLists = (req, res) => {

    TodoListModel.find({ 'userId': req.body.userId }, (err, result) => {

        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in getting todo list', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No task found')
            let apiResponse = response.generate(true, 'No todo list', 400, result)
            res.send(apiResponse)
        }else {
          //  res.send(result)
            let apiResponse = response.generate(false, 'All todo list', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteTodoList  = (req, res) => {
    TodoListModel.findOneAndRemove({ 'id': req.body.id}, (err, result) => {
        if (err) {
            console.log(err)
            let apiResponse = response.generate(true, 'error in delete todo list', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            console.log('No task found')
            let apiResponse = response.generate(true, 'No such todo list found', 400, result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'List deletion successful', 200, result)
            res.send(apiResponse)

        }
    })
}
module.exports = {
    addNewTask :addNewTask,
    getTaskFromList: getTaskFromList,
    deleteTaskFromList:deleteTaskFromList,
    updateTask : updateTask,
    addNewEmptyList : addNewEmptyList,
    getAllTodoLists :getAllTodoLists,
    deleteTodoList :deleteTodoList
    
}