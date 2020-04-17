const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib')
const sock_session = require('../libs/activeSockets')
/* Models */
const UserModel = mongoose.model('User')


let getListOfAllUsers = (req, res) => {
    
    let findUser = () => {
      return new Promise((resolve, reject) => {
       
  
        UserModel.find()
          .select('-_id -__v -email -password -createdOn -mobileNumber')
          .sort('-createdOn')
          .skip(parseInt(req.query.skip) || 0)
          .lean()
          .exec((err, result) => {
            if (err) {
              console.log(err)
              logger.error(err.message, 'allUser Controller: getlistOfAllUsers', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No more user', 'allUser Controller: getlistOfAllUsers')
              let apiResponse = response.generate(true, 'No more user available', 404, null)
              reject(apiResponse)
            } else {
              console.log('users found on platform')
  
              // reversing array.
              let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
   findUser(req,res)
      .then((result) => {
        let apiResponse = response.generate(false, 'Users on this platform', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  }

  module.exports = {
    getListOfAllUsers:getListOfAllUsers
  }