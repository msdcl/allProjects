const express = require('express');
const router = express.Router();
const dashboard = require("./../../app/controllers/dashboard");
const appConfig = require("./../../config/config")
const auth = require("./../../app/middlewares/auth");
module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion;


    app.post(`${baseUrl}/getNormalUsers` ,auth.authenticateUserWithHash,dashboard.getAllNormalUsers);
    
         /**
	 * @api {post} /api/v1/getNormalUsers getNormalUsers
	 * @apiVersion 0.0.1
	 * @apiGroup user
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
    
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All normal users",
	    "status": 200,
	    "data": [
					[{
						userId: "string",
						userName: "string",
						email: "string",
					}]
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "error in getting normal users",
	    "status": 500,
	    "data": null
	   }
	 */ 

    app.post(`${baseUrl}/addMeeting`,auth.authenticateUserWithHash, dashboard.addMeeting);
       /**
	 * @api {post} /api/v1/addMeeting addMeeting
	 * @apiVersion 0.0.1
	 * @apiGroup Meeting
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} createdBy createdBy as a body parameter
	 * @apiParam {String} userId userId as a body parameter
	 * @apiParam {String} userEmail user email as a body parameter
	 * @apiParam {String} name name of the event passed as a body parameter
     * @apiParam {String} startTime start time  of the event passed as a body parameter
	 * @apiParam {String} endTime end time of the event passed as a body parameter
     * @apiParam {String} description description of the event passed as a body parameter
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "meeting created",
	    "status": 200,
	    "data": [
					{
						id: "string",
						name: "string",
						description: "string",
                        createdBy: "string",
                        startTime: "string",
                        endTime: "string",
                        userId: "string",
                        userEmail: "string",
                        isSnoozed:boolean,
                        isDismissed:boolean
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to add new meeting",
	    "status": 500,
	    "data": null
	   }
	 */ 
    
    app.post(`${baseUrl}/updateMeeting`,auth.authenticateUserWithHash, dashboard.updateMeeting);

        /**
	 * @api {post} /api/v1/updateMeeting updateMeeting
	 * @apiVersion 0.0.1
	 * @apiGroup Meeting
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} id id of meeting passed as a body parameter
	 * @apiParam {String} name name of the event passed as a body parameter
     * @apiParam {String} startTime start time  of the event passed as a body parameter
	 * @apiParam {String} endTime end time of the event passed as a body parameter
     * @apiParam {String} description description of the event passed as a body parameter
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "meeting updated",
	    "status": 200,
	    "data": [
					{
						id: "string",
						name: "string",
						description: "string",
                        createdBy: "string",
                        startTime: "string",
                        endTime: "string",
                        userId: "string",
                        userEmail: "string",
                        isSnoozed:boolean,
                        isDismissed:boolean
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "update meeting failed",
	    "status": 500,
	    "data": null
	   }
	 */ 

    app.post(`${baseUrl}/deleteMeeting`,auth.authenticateUserWithHash, dashboard.deleteMeeting);

        /**
	 * @api {post} /api/v1/deleteMeeting deleteMeeting
	 * @apiVersion 0.0.1
	 * @apiGroup Meeting
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} id id of meeting passed as a body parameter
	
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "meeting deletion successful ",
	    "status": 200,
	    "data": [
					{
					
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "error in delete meeting",
	    "status": 500,
	    "data": null
	   }
	 */ 

    app.post(`${baseUrl}/getAllMeetings`,auth.authenticateUserWithHash, dashboard.getAllMeetings);

       /**
	 * @api {post} /api/v1/getAllMeetings getAllMeetings
	 * @apiVersion 0.0.1
	 * @apiGroup Meeting
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} userId userId passed as a body parameter
     * @apiParam {String} startTime start time  of the event passed as a body parameter
	 * @apiParam {String} endTime end time of the event passed as a body parameter
    
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All meetings",
	    "status": 200,
	    "data": [
					[{
						id: "string",
						name: "string",
						description: "string",
                        createdBy: "string",
                        startTime: "string",
                        endTime: "string",
                        userId: "string",
                        userEmail: "string",
                        isSnoozed:boolean,
                        isDismissed:boolean
					}]
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "error in getting meeting",
	    "status": 500,
	    "data": null
	   }
	 */ 

    app.post(`${baseUrl}/notifications`,auth.authenticateUserWithHash, dashboard.getAllTextNotifications);

      /**
	 * @api {post} /api/v1/notifications notifications
	 * @apiVersion 0.0.1
	 * @apiGroup notifications
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} userId userId passed as a body parameter
    
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All notifications",
	    "status": 200,
	    "data": [
					[{
						id: "string",
						userId: "string",
						text: "string",
                        isSeen:boolean
					}]
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "error in getting notifications",
	    "status": 500,
	    "data": null
	   }
	 */ 

    app.post(`${baseUrl}/notificationSeen`,auth.authenticateUserWithHash, dashboard.marknotificationAsSeen);
     
       /**
	 * @api {post} /api/v1/notificationSeen notificationSeen
	 * @apiVersion 0.0.1
	 * @apiGroup notifications
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as a header)
	 * @apiParam {String} userId userId passed as a body parameter
    
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "notification seen",
	    "status": 200,
	    "data": [
				 {
                     n:1
                 }
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "notification mark as seen failed",
	    "status": 500,
	    "data": null
	   }
	 */ 


	app.post(`${baseUrl}/snoozeOrDismissMeeting`,auth.authenticateUserWithHash, dashboard.updateSnoozedAndDismissed);
}