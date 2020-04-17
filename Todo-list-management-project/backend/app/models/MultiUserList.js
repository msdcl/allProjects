const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MultiToDoList = new Schema({
    id:{
        type:String
    },
  userId: {
    type: String
  },
  listName:{
   type:String
  },
  sharedWith:[String],
 isDone :{
     type:Boolean,
     default:false
 }
})

module.exports = mongoose.model('MultiToDoList',MultiToDoList)

