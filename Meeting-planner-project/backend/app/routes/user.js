const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/user");
const appConfig = require("./../../config/config")
const auth = require("./../../app/middlewares/auth");
module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion;


    app.post(`${baseUrl}/signup` ,userController.signUpFunction);
      /**
	 * @api {post} /api/v1/signup signup
	 * @apiVersion 0.0.1
	 * @apiGroup user
	 *
	
	 * @apiParam {String} userName user name passed as a body parameter
	 * @apiParam {String} email email of the product passed as a body parameter
	 * @apiParam {String} password password passed as a body parameter
	 * @apiParam {String} countryCode countryCode passed as a body parameter
     * @apiParam {String} mobileNumber mobileNumber passed as a body parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "signup successfully",
	    "status": 200,
	    "data": [
					{
						userId: "string",
						userName: "string",
						mobileNumber: "string",
						code: "string",
						password: "string",
                        isAdmin :boolean,
                        createdOn:Date
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	 */ 


    app.post(`${baseUrl}/login`, userController.loginFunction);

     /**
	 * @api {post} /api/v1/login login
	 * @apiVersion 0.0.1
	 * @apiGroup user
	 *
	

	 * @apiParam {String} email email of the product passed as a body parameter
	 * @apiParam {String} password password passed as a body parameter

	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "login successfully",
	    "status": 200,
	    "data": [
					{
						userId: "string",
						email: "string",
						token: "string",
                        isAdmin :boolean,
                       
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	 */ 
    
    app.post(`${baseUrl}/logout`, auth.authenticateUserWithHash,userController.logout);
       /**
	 * @api {post} /api/v1/logout logout
	 * @apiVersion 0.0.1
	 * @apiGroup user
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "logout successful",
	    "status": 200,
	    "data": [
					{
					n=1
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To logout",
	    "status": 500,
	    "data": null
	   }
	 */ 



    app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);
    
    /**
    * @api {post} /api/v1/forgotPassword forgot Password
    * @apiVersion 0.0.1
    * @apiGroup user
    *
    * @apiParam {String} email email of the product passed as a body parameter
    *
    *  @apiSuccessExample {json} Success-Response:
    *  {
       "error": false,
       "message": "We have sent an email",
       "status": 200,
       "data": [
                   {
                       email: "string",
                   }
               ]
           }
       }
   }
     @apiErrorExample {json} Error-Response:
    *
    * {
       "error": true,
       "message": "Error Occured.,
       "status": 500,
       "data": null
      }
    */ 

    app.post(`${baseUrl}/changePassword`, userController.changePassword);

    /**
    * @api {post} /api/v1/changePassword changePassword
    * @apiVersion 0.0.1
    * @apiGroup user
    *
    * @apiParam {String} email email of the product passed as a body parameter
    *
    *  @apiSuccessExample {json} Success-Response:
    *  {
       "error": false,
       "message": "Password has been changed",
       "status": 200,
       "data": [
                   {
                       email: "string",
                   }
               ]
           }
       }
   }
     @apiErrorExample {json} Error-Response:
    *
    * {
       "error": true,
       "message": "Error Occured.,
       "status": 500,
       "data": null
      }
    */ 
}
