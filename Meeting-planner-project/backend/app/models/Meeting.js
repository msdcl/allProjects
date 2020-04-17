'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let meetingSchema = new Schema({
  id: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  createdBy: {
    type: String,
  
  },
  userId:{
      type:String
  },
  userEmail:{
    type:String
},
  startTime: {
    type: String
  },
  endTime: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 0
  },
  description :{
    type:String,
    default:""
  },
  isSnoozed:{
    type:Boolean,
    default:false
  },
  isDismissed:{
    type:Boolean,
    default:false
  },
  lastNotification:{
    type:String,
    default:''
  }


})


mongoose.model('Meeting', meetingSchema);