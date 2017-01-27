var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var AccountController = require('./controller/accountController');
var accountController = new AccountController();
var ChallengeController = require('./controller/challengeController');

var server = express();
server.use(bodyParser.json());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var tokenTimeout = 10 * 60; //10 minutes
var ServerErrorCodes = {
    NotLoggedIn: 501
};

server.post('/cityGuess', function (req, res) {
    var body = req.body;
    var lat = body.lat;
    var lng = body.lng;
    var token = body.token;

    accountController.FetchAccount(token, function(success, account){
        if(!success){
            res.json({
                ErrCode: ServerErrorCodes.NotLoggedIn
            });
        }
        else{
            var result = ChallengeController.CityGuess(account.userId, lat, lng);
            res.json(result);
        }
    });
});

server.post('/challengeInfo', function(req, res){
    var body = req.body;
    var token = body.token;
    var challengeId = body.challengeId;

    accountController.FetchAccount(token, function(success, account){
        if(!success){
            res.json({
               ErrCode: ServerErrorCodes.NotLoggedIn 
            });
        }
        else{
            ChallengeController.ChallengeInfo(account.userId, challengeId, function(challenge){
                res.json(challenge);
            });
        }
    });
});

server.post('/startChallenge', function(req, res){
    var body = req.body;
    var token = body.token;
    var challengeId = body.challengeId;

    accountController.FetchAccount(token, function(success, account){
        if(!success){
            res.json({
                ErrCode: ServerErrorCodes.NotLoggedIn 
            });
        }
        else{
            ChallengeController.StartChallenge(account.userId, challengeId, function(challenge){
                res.json(challenge);
            });
        }
    });
});

server.post('/syncTimeout', function(req, res){
    var body = req.body;
    var token = body.token;

    accountController.FetchAccount(token, function(success, account){
        if(!success){
            res.json({
                ErrCode: ServerErrorCodes.NotLoggedIn 
            });
        }
        else{
            var result = ChallengeController.SyncTimeout(account.userId);
            res.json(result);
        }
    });
});

server.post('/nextCity', function(req, res){
    var body = req.body;
    var token = body.token;

    accountController.FetchAccount(token, function(success, account){
        if(!success){
            res.json({
                ErrCode: ServerErrorCodes.NotLoggedIn
            });
        }
        else{
            var result = ChallengeController.NextCity(account.userId);
            res.json(result);
        }
    });
});

server.post('/signup', function(req, res){
    var body = req.body;
    var email = body.email;
    var passHash = body.passHash;

    accountController.SignUp(email, passHash, function(message){
        res.json(message);
    });
});

server.post('/login', function(req, res){
    var body = req.body;
    var email = body.email;
    var passHash = body.passHash;

    accountController.Login(email, passHash, function(success, account){
        if(!success){
            res.json({
                success: false,
                token: "" 
            });
        }
        else{
            res.json({
                success: true,
                token: account.token
            });
        }
    });
});

server.post('/logout', function(req, res){
    var body = req.body;
    var token = body.token;

    accountController.LogOut(token, function(success){
        res.json({
            success: success
        })
    });
});

server.get('/verifyAccount/:hash', function(req, res){
    var hash = req.params.hash;

    accountController.Verify(hash, function(){
        
    });
});

server.get('/image/:path', function (req, res) {
    fs.readFile('./images/' + req.params.path, function(err, data){
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(data);
    });
});

server.listen(4300);