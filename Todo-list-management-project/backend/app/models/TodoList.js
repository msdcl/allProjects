const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TodoList = new Schema({
    id:{
        type:String
    },
  userId: {
    type: String
  },
  listName : {
   type:String
  }
})

module.exports = mongoose.model('TodoList',TodoList)