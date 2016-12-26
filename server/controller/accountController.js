var LoginController = require('./loginController');

function AccountController(){
    var LoggedInArray = [];
    var loginController = new LoginController();

}

AccountController.prototype.FetchAccount = function(token, cb){
    
}

AccountController.prototype.Login = function(email, passHash, cb){
    this.loginController.LogIn(email, passHash, function(message){
        
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

