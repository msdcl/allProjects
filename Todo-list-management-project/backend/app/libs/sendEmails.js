const nodemailer = require('nodemailer');

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
  
          console.log('Email sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
}


module.exports = {
    sendForgotPasswordEmail:sendForgotPasswordEmail
}