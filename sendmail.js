function sendEmail(fromName, emailData) {
    const mailer = require('nodemailer');

    const transporter = mailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        });

    const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'Запись на семинар от ' + fromName,
            text: emailData
    };

    transporter.sendMail (mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

exports.sendEmail = sendEmail;