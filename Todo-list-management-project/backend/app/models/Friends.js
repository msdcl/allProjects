'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let FriendsSchema = new Schema({

  id: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userId: {
    type: String,
    default: ''
  },
  friendId: {
    type: String,
    default: ''
  },
  friendName: {
    type: String,
    default: ''
  }


})


mongoose.model('Friends', FriendsSchema);