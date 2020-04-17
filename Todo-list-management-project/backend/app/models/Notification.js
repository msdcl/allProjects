'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let NotificationSchema = new Schema({

  id: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  name: {
    type: String,
  
  },
  nameBy: {
    type: String,
  
  },
 
  requestedBy: {
    type: String,
 
  },
  requestedTo: {
    type: String,
  
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('Notification', NotificationSchema);