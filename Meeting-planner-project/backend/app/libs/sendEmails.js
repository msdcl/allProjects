const nodemailer = require('nodemailer');
const time = require('../libs/timeLib')
// Generate SMTP service account from ethereal.email

let sendForgotPasswordEmail = (toEmail,code)=>{
    let transporter = nodemailer.createTransport({
           service:'gmail',
          auth: {
              user: 'msc1994dc@gmail.com',
              pass: 'msc11dc15'
          }
      });
  
      // Message object
      let message = {
          from: 'msc1994dc@gmail.com',
          to: `${toEmail}`,
          subject: 'Forgot password',
          text: `Hi your secure code is - ${code}`,
  
      };
  
      transporter.sendMail(message, (err, info) => {
          if (err) {
              console.log('Error occurred. ' + err.message);
              return process.exit(1);
          }
  
        //   console.log('Email sent: %s', info.messageId);
        //   // Preview only available when sending through an Ethereal account
        //   console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
}

let meetingCreationEmail = (data,toEmail)=>{
    let transporter = nodemailer.createTransport({
        service:'gmail',
       auth: {
           user: 'msc1994dc@gmail.com',
           pass: 'msc11dc15'
       }
   });
 let startTime = time.getTimeFromEpoch(data.startTime)
 let endTime = time.getTimeFromEpoch(data.endTime)
   // Message object
   let message = {
       from: 'msc1994dc@gmail.com',
       to: `${toEmail}`,
       subject: 'New event created',
       text: `Hi, new meeting is created by admin. See below details \n
              Admin: ${data.createdBy}\n
              name: ${data.name}\n
              startTime: ${startTime}\n
              endTime: ${endTime}\n
              description: ${data.description}\n`,

   };

   transporter.sendMail(message, (err, info) => {
       if (err) {
           console.log('Error occurred. ' + err.message);
          
          return process.exit(1);
       }
       
    //    console.log('Email sent: %s', info.messageId);
    //    // Preview only available when sending through an Ethereal account
    //    console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
     
   });
}


let meetingUpdatedEmail = (data,toEmail)=>{
    let transporter = nodemailer.createTransport({
        service:'gmail',
       auth: {
           user: 'msc1994dc@gmail.com',
           pass: 'msc11dc15'
       }
   });
   let startTime = time.getTimeFromEpoch(data.startTime)
   let endTime = time.getTimeFromEpoch(data.endTime)
   // Message object
   let message = {
       from: 'msc1994dc@gmail.com',
       to: `${toEmail}`,
       subject: 'update on meeting',
       text: `Hi, there is an update on an event. See below details \n
       Admin: ${data.createdBy}\n
       name: ${data.name}\n
       startTime: ${startTime}\n
       endTime: ${endTime}\n
       description: ${data.description}\n`

   };

   transporter.sendMail(message, (err, info) => {
       if (err) {
           console.log('Error occurred. ' + err.message);
         return process.exit(1);
        
       }

    //    console.log('Email sent: %s', info.messageId);
    //    // Preview only available when sending through an Ethereal account
    //    console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // cb(null,info);
   });
}


let meetingReminderEmail = (data)=>{
    let transporter = nodemailer.createTransport({
        service:'gmail',
       auth: {
           user: 'msc1994dc@gmail.com',
           pass: 'msc11dc15'
       }
   });
   let startTime = time.getTimeFromEpoch(data.startTime)
   let endTime = time.getTimeFromEpoch(data.endTime)
  
   // Message object
   let message = {
       from: 'msc1994dc@gmail.com',
       to: `${data.userEmail}`,
       subject: 'reminder for your meeting',
       text: `Hi, this is reminder for the event. See below details \n
       Admin: ${data.createdBy}\n
       name: ${data.name}\n
       startTime: ${startTime}\n
       endTime: ${endTime}\n
       description: ${data.description}\n`

   };

   transporter.sendMail(message, (err, info) => {
       if (err) {
           console.log('Error occurred. ' + err.message);
          return process.exit(1);
        
       }

    //    console.log('Email sent: %s', info.messageId);
    //    // Preview only available when sending through an Ethereal account
    //    console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // cb(null,info);
   });
}



let meetingCancelledEmail = (data)=>{
    let transporter = nodemailer.createTransport({
        service:'gmail',
       auth: {
           user: 'msc1994dc@gmail.com',
           pass: 'msc11dc15'
       }
   });
   let startTime = time.getTimeFromEpoch(data.startTime)
   let endTime = time.getTimeFromEpoch(data.endTime)
  
   // Message object
   let message = {
       from: 'msc1994dc@gmail.com',
       to: `${data.userEmail}`,
       subject: 'Event cancelled',
       text: `Hi, An event has been cancelled. See below details \n
       Admin: ${data.createdBy}\n
       name: ${data.name}\n
       startTime: ${startTime}\n
       endTime: ${endTime}\n
       description: ${data.description}\n`

   };

   transporter.sendMail(message, (err, info) => {
       if (err) {
           console.log('Error occurred. ' + err.message);
          return process.exit(1);
        
       }

    //    console.log('Email sent: %s', info.messageId);
    //    // Preview only available when sending through an Ethereal account
    //    console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // cb(null,info);
   });
}
module.exports = {
    sendForgotPasswordEmail:sendForgotPasswordEmail,
    meetingCreationEmail:meetingCreationEmail,
    meetingUpdatedEmail:meetingUpdatedEmail,
    meetingReminderEmail:meetingReminderEmail,
    meetingCancelledEmail:meetingCancelledEmail
}