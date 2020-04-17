/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
const sock_session = require("./activeSockets")
const redisLib = require("./redisLib.js");



let setServer = (server) => {

    //let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {
       
       socket.on('new-todo-list', (data) => {

            console.log("new-todo-list event listened")


            let key = data.name
            let value = data.createdBy

            let setUserOnline = redisLib.setTodoListInSet(value, key, (err, result1) => {
                if (err) {
                    console.log(`some error occurred`)
                } else {
                if(result1==1){
                    redisLib.getTodoListFromSet(value, (err, result2) => {
                        console.log(`--- inside getTodoListFromHash function ??? ---`)
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(result2)
                            let data = {
                                error :false,
                                list : result2
                            }
                            myIo.emit('existing-todo-lists', data);


                        }
                    })
                  }else{
                    let data = {
                        error :true,
                        list : ""
                    }
                    myIo.emit('existing-todo-lists', data);
                  }
                }
            })
        })

        socket.on('registeredUser',(userId)=>{
          sock_session.sessions[userId]=socket
        })

        socket.on('do-user-log-out',(userId)=>{
           delete sock_session.sessions[userId]
          })
       

        socket.on('alredy-existing-todo-lists', (data) => {
            console.log("existing-todo-lists event listened")

            redisLib.getTodoListFromSet(data, (err, result2) => {
                console.log(`--- inside getTodoListFromSet function ---`)
                if (err) {
                    console.log(err)
                } else {
                    let data = {
                        error :false,
                        list : result2
                    }
                    socket.emit('existing-todo-lists', data);

                }
            })


        })


        socket.on('delete-todo-list', (data) => {

            redisLib.deleteTOdoListFromSet(data.userId, data.name, (err, result) => {
                if (err) {
                    console.log("Error while deleteing todo list");
                } else {
                    redisLib.getTodoListFromSet(data.userId, (err, result2) => {
                        console.log(`--- inside getTodoListFromSet function ---`)
                        if (err) {
                            console.log(err)
                        } else {
                            let data = {
                                error :false,
                                list : result2
                            }
                            io.sockets.emit('existing-todo-lists', data);
                        }
                    })
                }
            })
        })



        socket.on('add-item-to-list', (data) => {

            console.log("new-todo-list event listened")


            let newtem = data.newItem;
            let value = `${data.userId}-${data.currList}`

            let setUserOnline = redisLib.setTodoListInSet(value, newtem, (err, result1) => {
                if (err) {
                    console.log(`some error occurred`)
                } else {
                if(result1==1){
                    redisLib.getTodoListFromSet(value, (err, result2) => {
                        console.log(`--- inside getTodoListFromHash function ??? ---`)
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(result2)
                            let data = {
                                error :false,
                                list : result2
                            }
                            myIo.emit('all-items-of-list', data);


                        }
                    })
                  }else{
                    let data = {
                        error :true,
                        list : ""
                    }
                    myIo.emit('all-items-of-list', data);
                  }
                }
            })
        })


        socket.on('alredy-existing-items-of-lists', (data) => {
            console.log("alredy-existing-items-of-lists listened")
           let setName = `${data.userId}-${data.currList}`
            redisLib.getTodoListFromSet(setName, (err, result2) => {
                console.log(`--- inside getTodoListFromSet function ---`)
                if (err) {
                    console.log(err)
                } else {
                    let data = {
                        error :false,
                        list : result2
                    }
                   myIo.emit('all-items-of-list', data);

                }
            })


        })


        socket.on('delete-task-from-todo-list', (data) => {
            let setName = `${data.userId}-${data.currList}`
            redisLib.deleteTOdoListFromSet(setName, data.name, (err, result) => {
                if (err) {
                    console.log("Error while deleteing task from list");
                } else {
                    redisLib.getTodoListFromSet(setName, (err, result2) => {
                        console.log(`--- inside getTodoListFromSet function ---`)
                        if (err) {
                            console.log(err)
                        } else {
                            let data = {
                                error :false,
                                list : result2
                            }
                            myIo.emit('all-items-of-list', data);
                        }
                    })
                }
            })
        })


        socket.on('mark-task-as-complete-incomplete', (data) => {
            let setName = `${data.userId}-${data.currList}`
            redisLib.deleteTOdoListFromSet(setName, data.name, (err, result) => {
                if (err) {
                    console.log("Error while deleteing task from list");
                } else {
                    console.log("add updated version")
                   
                    let newtem = data.newItem;
                    let value = `${data.userId}-${data.currList}`
        
                    let setUserOnline = redisLib.setTodoListInSet(value, newtem, (err, result1) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            redisLib.getTodoListFromSet(value, (err, result2) => {
                                console.log(`--- inside getTodoListFromSet function ??? ---`)
                                if (err) {
                                    console.log(err)
                                } else {
        
                                    console.log(result2)
                                    let data = {
                                        error :false,
                                        list : result2
                                    }
                                    myIo.emit('all-items-of-list', data);
                                }
                            })
                          
                        }
                    })
                }
            })
        })



        socket.on('add-subtask-to-list', (data) => {

            console.log("add-subtask-to-list event listened")


            let newtem = data.newItem;
            let value = `${data.userId}-${data.currList}`

            let setUserOnline = redisLib.setTodoListInSet(value, newtem, (err, result1) => {
                if (err) {
                    console.log(`some error occurred`)
                } else {
                if(result1==1){
                    redisLib.getTodoListFromSet(value, (err, result2) => {
                        console.log(`--- inside getTodoListFromSet function to get subtasks ---`)
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(result2)
                            let data = {
                                error :false,
                                list : result2
                            }
                            myIo.emit('all-subtasks-of-list', data);


                        }
                    })
                  }else{
                    let data = {
                        error :true,
                        list : ""
                    }
                    myIo.emit('all-subtasks-of-list', data);
                  }
                }
            })
        })
    });

    

}



module.exports = {
    setServer: setServer
}
