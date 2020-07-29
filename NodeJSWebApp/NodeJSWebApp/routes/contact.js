var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgunapi-transport');

module.exports.sendEmail = function (req, res) {
    var name = req.body.Name , email = req.body.Email, subject = req.body.Subject, message = req.body.Message;

    var auth = {
        auth: {
            api_key : 'key-63afff5d90d00a026a71c25be83df806',
            domain: 'mail.josk.ca'
        }
    }
    
    var nodemailerMailGun = nodemailer.createTransport(mg(auth));
    
    nodemailerMailGun.sendMail({
        from: 'mailgun@mail.josk.ca',
        to: email,
        subject: subject,
        text: message
    }, function (err, info) {
        if (err) {
            console.log(err);
        }
    });

};