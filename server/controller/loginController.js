var LoginInformationDAO = require('../data/loginInformationDAO');
var nodemailer = require('nodemailer');
var SecretData = require('./secretData');
var Utils = require('./utils');

var URLSchema = "http://";
var URLServer = "localhost:4300/";

function CreateToken(email){
    var date = new Date();
    var blob = email + date.getMilliseconds().toString();
    var shaHash = Utils.StringToHexSha256(blob);
    return shaHash.slice(0, 9);
}

function UpdateLastAccessByEmail(email, cb){
    LoginInformationDAO.FindByEmail(email, function(success, doc){
        if(success){
            var lastAccess = Math.floor(Date.now() / 1000);
            LoginInformationDAO.Update(document.email,
                                       document.passHash,
                                       document.token,
                                       document.verified,
                                       lastAccess,
                                       function(success){
                                           cb(success);
                                       });
        }
        else{
            console.log("UpdateLastAccessByEmail: Account not found");
            cb(false);
        }
    });
}

function UpdateLastAccess(document, cb){
    var lastAccess = Math.floor(Date.now() / 1000);

    LoginInformationDAO.Update(document.email,
                               document.passHash,
                               document.token,
                               document.verified,
                               lastAccess,
                               function(success){
                                   cb(success);
                               });
}

function LoginController() {
    var LoggedInArray = [];
}

LoginController.prototype.SignUp = function (email, passHash, cb) {
    LoginInformationDAO.FindByEmail(email, function (success, doc) {
        if (success) {
            console.log("Signup: Account already exists");
            cb({
                success: false,
                msg: "Account already exists"
            });
        }
        else {
            LoginInformationDAO.Create(email, passHash, function (success, insertedId) {
                if (success) {
                    var mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: SecretData.email,
                            pass: SecretData.password
                        }
                    });

                    var hash = Utils.StringToHexSha256(insertedId + "");
                    
                    var mailOptions = {
                        from: '"Map Game Noreply" <noreply@mapgame.com>',
                        to: email,
                        subject: 'Map Game Verification',
                        text: 'URL to verify account: ' + URLSchema + URLServer + 'verifyAccount/' + hash,
                        html: '<b>Map Game!</b><br>\n' +
                              'Click <a href="' + URLSchema + URLServer + 'verifyAccount/' + hash + '">here</a> to verify your account'
                    };

                    mailTransporter.sendMail(mailOptions, function(error, info){
                        if(info != null)
                            console.log(info.response);
                    });

                    console.log("Signup: OK");
                    cb({
                        success: true,
                        msg: "OK"
                    });
                }
                else {
                    console.log("Signup: Could not add new account");
                    cb({
                        success: false,
                        msg: "Could not add new account"
                    });
                }
            });
        }
    });
}

LoginController.prototype.LogIn = function (email, passHash, tokenTimeout, cb) {
    LoginInformationDAO.FindByEmail(email, function (success, doc) {
        if (success) {
            if (doc.passHash == passHash) {
                if (doc.verified) {
                    var now = Date.now();
                    if(doc.lastAccess + tokenTimeout < now){
                        console.log("LogIn: Token Expired");

                        var token = CreateToken(doc.email);
                        doc.token = token;
                        UpdateLastAccess(doc, function(success){
                            if(success){
                                console.log("LogIn: OK");
                                cb({
                                    success: true,
                                    msg: "OK",
                                    token: doc.token
                                });
                            }
                            else{
                                console.log("LogIn: Error when updating last access");
                                cb({
                                    success: false,
                                    msg: "Error when updating last access",
                                    token: ""
                                });
                            }
                        });
                    }
                    else{
                        console.log("LogIn: OK");
                        cb({
                            success: true,
                            msg: "OK",
                            token: doc.token
                        });
                    }
                }
                else {
                    console.log("LogIn: Account is not yet verified");
                    cb({
                        success: false,
                        msg: "Account is not yet verified",
                        token: ""
                    });
                }
            }
            else {
                console.log("LogIn: Could not find account");
                cb({
                    success: false,
                    msg: "Could not find account",
                    token: ""
                });
            }

        }
        else {
            console.log("LogIn: Could not find account");
            cb({
                success: false,
                msg: "Could not find account",
                token: ""
            });
        }
    });
}

LoginController.prototype.Verify = function(hash, cb){
    console.log("hash: " + hash);
    LoginInformationDAO.FindAll(function(success, docs){
        if(success){
            var updatedElement = null;

            docs.forEach(function(element, index, array){
                if(Utils.StringToHexSha256(element._id + "") == hash)
                {
                    updatedElement = element;
                }
            });

            if(updatedElement != null){
                LoginInformationDAO.Update(updatedElement.email, updatedElement.passHash, updatedElement.token, true, function(success){
                    if(success){
                        console.log("Verify: OK");
                        cb({
                            success: true,
                            msg: "OK"
                        });
                    }
                    else{
                        console.log("Verify: Error updating account");
                        cb({
                            success: false,
                            msg: "Error updating account"
                        });
                    }
                });
            }
            else{
                console.log("Verify: Could not find account");
                cb({
                    success: false,
                    msg: "Could not find account"
                });
            }
        }
        else{
            console.log("Verify: Could not find account");
            cb({
                success: false,
                msg: "Could not find account"
            });
        }
    });
}

module.exports = LoginController;