var LoginController = require('./loginController');
var AccountDAO = require('../data/accountDAO');

var createdTokenTimeout = 3600 * 24 * 30 * 6; //6 months
var lastAccessTokenTimeout = 3600 * 24 * 30; //1 month

function AccountController(){
    var LoggedInArray = [];
    var loginController = new LoginController();

}

function IsTokenValid(createdDate, lastAccess){
    var now = Math.floor(Date.now() / 1000);
    if((now > createdDate + createdTokenTimeout) || (now > lastAccess + lastAccessTokenTimeout))
        return false;
    else
        return true;
}

AccountController.prototype.FetchAccount = function(token, cb){
    var account = this.LoggedInArray.find(function(element){
        return element.token == token;
    });

    if(account == null){
        this.loginController.FetchByToken(token, function(success, doc){
            if(!success){
                cb(false, null);
            }
            else{
                if(IsTokenValid(doc.createdDate, doc.lastAccess)){
                    AccountDAO.FindByToken(message.token, function(success, doc){
                        if(!success){
                            console.log("Error retrieving user information");
                            cb(false, null);
                        }
                        else{
                            this.LoggedInArray.push(doc);
                            cb(true, doc);
                        }
                    });
                }
                else{
                    cb(false, null);
                }
            }
        });
    }
    else{
        cb(true, account);
    }
}

AccountController.prototype.Login = function(email, passHash, cb){
    this.loginController.LogIn(email, passHash, function(message){
        if(!message.success){
            console.log("Error with login");
            cb(false, null);
        }
        else{
            AccountDAO.FindByToken(message.token, function(success, doc){
                if(!success){
                    console.log("Error retrieving user information");
                    cb(false, null);
                }
                else{
                    this.LoggedInArray.push(doc);
                    cb(true, doc);
                }
            });
        }
    });
}

AccountController.prototype.LogOut = function(token, cb){
    this.loginController.LogOut(token, function(success){
        if(success){
            var idx = this.LoggedInArray.indexOf(function(element, index, array){
                return element.token == token;
            });
            if(idx != -1){
                this.LoggedInArray.splice(idx, 1);
            }
        }
    });
}

AccountController.prototype.SignUp = function(email, passHash, cb){
    this.loginController.SignUp(email, passHash, function(message){
        cb(message);
    });
}

AccountController.prototype.Verify = function(email, hash, cb){
    this.loginController.Verify(hash, function(message){
        if(message.success){
            AccountDAO.Create()
        }
        else{
            cb(false);
        }
    });
}

AccountController.prototype.UpdateUserInfo = function(){}

AccountController.prototype.CleanLoggedInArray() = function(){}