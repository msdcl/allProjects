const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TaskModel = new Schema({
    id:{
        type:String
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

module.exports = mongoose.model('TaskModel',TaskModel)

