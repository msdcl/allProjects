'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let notification = new Schema({
  id: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userId: {
    type: String,
  },
  text: {
    type: String,
  },
  isSeen:{
    type:Boolean
  },
  date:{
    type:Date,
    default:''
  }


})


mongoose.model('Notification', notification);