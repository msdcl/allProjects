const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TextNotification = new Schema({
    id:{
        type:String
    },
  userId: {
    type: String
  },
  text:{
   type:String
  },
  isSeen :{
      type:Boolean
  },
  date:{
      type:Date,
      default:''
  }
})

module.exports = mongoose.model('TextNotification',TextNotification)

