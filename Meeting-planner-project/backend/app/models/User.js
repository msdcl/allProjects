'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: String,
    default: 0
  },
  createdOn :{
    type:Date,
    default:""
  },
  countryCode :{
    type:String,
    default:""
  },
  isAdmin:{
    type:Boolean
  },
  tokens:[String]


})


mongoose.model('User', userSchema);