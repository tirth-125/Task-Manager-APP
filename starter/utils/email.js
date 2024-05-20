const nodemailer = require('nodemailer');

const sendEmail = async (option)=>{
    // CREATE TRANSPORTER
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASSWORD
            }
        })
        // DEFINE THE OPTIONS
        const emailOption = {
            from : 'Cineflex suppport<support@cineflex.com>',
            to : option.email,
            subject : option.subject,
            text : option.message
        }
        // console.log("email = " + sendEmail );
        // console.log("emamilOption = " + emailOption);    
        await transporter.sendMail(emailOption);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
    
}

module.exports = sendEmail; 