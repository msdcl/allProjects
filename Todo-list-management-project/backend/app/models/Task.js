const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Task = new Schema({
    id:{
        type:String
    },
  userId: {
    type: String
  },
  listName : {
   type:String
  },
  taskName: {
    type: String
  },
 isDone :{
     type:Boolean
 }
})

module.exports = mongoose.model('Task',Task)

