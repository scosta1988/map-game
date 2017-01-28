var LoginController = require('./loginController');
var AccountDAO = require('../data/accountDAO');

var createdTokenTimeout = 3600 * 24 * 30 * 6; //6 months
var lastAccessTokenTimeout = 3600 * 24 * 30; //1 month

function AccountController(){
    this.LoggedInArray = [];
    this.loginController = new LoginController();

    this.LoggedInArrayMgmtInterval = setInterval(this.CleanLoggedInArray.bind(this), 5000);
}

function IsTokenValid(createdDate, lastAccess){
    var now = Math.floor(Date.now() / 1000);
    if((now > createdDate + createdTokenTimeout) || (now > lastAccess + lastAccessTokenTimeout))
        return false;
    else
        return true;
}

AccountController.prototype.FetchAccount = function(token, cb){
    var LoggedInArray = this.LoggedInArray;
    var account = LoggedInArray.find(function(element){
        return element.token == token;
    });

    if(account == null){
        this.loginController.FetchByToken(token, function(success, doc){
            if(!success){
                cb(false, null);
            }
            else{
                if(IsTokenValid(doc.createdDate, doc.lastAccess)){
                    AccountDAO.FindByToken(doc.token, function(success, doc){
                        if(!success){
                            console.log("Error retrieving user information");
                            cb(false, null);
                        }
                        else{
                            LoggedInArray.push(doc);
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
    var LoggedInArray = this.LoggedInArray;
    this.loginController.Login(email, passHash, function(message){
        if(!message.success){
            console.log("Error with login");
            cb(false, null);
        }
        else{
            AccountDAO.FindByEmail(email, function(success, doc){
                if(!success){
                    console.log("Error retrieving user information");
                    cb(false, null);
                }
                else{
                    doc.token = message.token;
                    AccountDAO.UpdateToken(email, doc.token, function(success){
                        if(!success){
                            cb(false, null);
                        }
                        else{
                            LoggedInArray.push(doc);
                            cb(true, doc);
                        }
                    });
                }
            });
        }
    });
}

AccountController.prototype.LogOut = function(token, cb){
    var LoggedInArray = this.LoggedInArray;
    this.loginController.LogOut(token, function(success){
        if(success){
            var idx = LoggedInArray.indexOf(function(element, index, array){
                return element.token == token;
            });
            if(idx != -1){
                LoggedInArray.splice(idx, 1);
            }
            cb(true);
        }
        else{
            cb(false);
        }
    });
}

AccountController.prototype.SignUp = function(email, passHash, cb){
    this.loginController.SignUp(email, passHash, function(message){
        cb(message);
    });
}

AccountController.prototype.Verify = function(hash, cb){
    this.loginController.Verify(hash, function(message){
        if(message.success){
            var loginInformation = message.loginInformation;
            AccountDAO.Create(loginInformation.email, loginInformation.name, loginInformation.token,
                              loginInformation.email, function(success, insertedId){
                                  if(success){
                                      cb(true);
                                  }
                                  else{
                                      cb(false);
                                  }
            });
        }
        else{
            cb(false);
        }
    });
}

AccountController.prototype.UpdateUserInfo = function(email, name, picture, achievements, history, friends, cb){
    AccountDAO.FindByEmail(email, function(success, document){
        if(!success){
            cb(false);
        }
        else{
            AccountDAO.Update(email, name, document.token, document.userId, picture, achievements, history, friends, function(success){
                cb(success);
            });
        }
    });
}

AccountController.prototype.CleanLoggedInArray = function(){
    var now = Math.floor(Date.now() / 1000);

    var i = 0;
    while(i < this.LoggedInArray.length){
        if(this.LoggedInArray[i].lastAccess + 600 < now){ //more than 10 minutes have passed
            this.LoggedInArray.splice(i, 1);
        }
        else{
            i++;
        }
    }
}

module.exports = AccountController;