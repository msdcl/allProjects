const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SubTask = new Schema({
    id:{
        type:String
    },
  parentId: {
    type: String
  },
  subTask:{
   type:String
  },
 isDone :{
     type:Boolean
 }
})

module.exports = mongoose.model('SubTask',SubTask)

