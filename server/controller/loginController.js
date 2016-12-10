var LoginInformationDAO = require('../data/loginInformationDAO');
var nodemailer = require('nodemailer');
var SecretData = require('./secretData');

function LoginController() {
    var LoggedInArray = [];
}

LoginController.prototype.SignUp = function (email, passHash, cb) {
    LoginInformationDAO.FindByEmail(email, function (success, docs) {
        if (success) {
            cb({
                success: false,
                msg: "Account already exists"
            });
        }
        else {
            var token = "bla87y";

            LoginInformationDAO.Create(email, passHash, token, function (success) {
                if (success) {
                    var mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: SecretData.email,
                            pass: SecretData.password
                        }
                    });

                    var mailOptions = {
                        from: '"Fred Foo 👥" <foobar@bar.com>', // sender address
                        to: 'foobar@foo.com', // list of receivers
                        subject: 'Map Game', // Subject line
                        text: 'Map Game', // plaintext body
                        html: '<b>Map Game! 🐴</b>' // html body
                    };

                    mailTransporter.sendMail(mailOptions, function(error, info){
                        console.log(info.response);
                    });

                    cb({
                        success: true,
                        msg: "OK"
                    });
                }
                else {
                    cb({
                        success: false,
                        msg: "Could not add new account"
                    });
                }
            });
        }
    });
}

LoginController.prototype.LogIn = function (email, passHash, cb) {
    LoginInformationDAO.FindByEmail(email, function (success, doc) {
        if (success) {
            if (doc.passHash == passHash) {
                if (doc.verified) {
                    cb({
                        success: true,
                        msg: "OK",
                        token: doc.token
                    });
                }
                else {
                    cb({
                        success: false,
                        msg: "Account is not yet verified",
                        token: ""
                    });
                }
            }
            else {
                cb({
                    success: false,
                    msg: "Could not find account",
                    token: ""
                });
            }

        }
        else {
            cb({
                success: false,
                msg: "Could not find account",
                token: ""
            });
        }
    });
}

module.exports = LoginController;