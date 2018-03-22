var mailer = require('nodemailer');

var transporter = mailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
	user: 'pabloli@yandex.ru',
	pass: 'ICstwtn47:)'
    }
});

var mailOptions = {
    from: 'pabloli@yandex.ru',
    to: 'pablol@mail.ru',
    subject: 'Test node mailer',
    html: '<h3>This is email sent from Node.Js</h3>'
};

transporter.sendMail (mailOptions, function(error, info){
    if (error) {
	console.log(error);
    } else {
	console.log('Email sent: ' + info.response);
    }
});
