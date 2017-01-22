var express = require('express');
var ChallengeData = require('./challengeData');
var bodyParser = require('body-parser');
var fs = require('fs');
var loginControllerFactory = require('./controller/loginController');
var loginController = new loginControllerFactory();
var SHA256 = require('crypto-js/sha256');
var Utils = require('./controller/utils');

var server = express();
server.use(bodyParser.json());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var tokenTimeout = 10 * 60; //10 minutes

server.post('/challengeAnswer', function (req, res) {
    var body = req.body;

    var city = ChallengeData.cities[parseInt(body.id)];
    var distance = calculateDistance(body.lat, body.lng, city.lat, city.lng);
    var time = body.time;

    var points = calculatePoints(distance, time);

    console.log("Distance to " + city.name + " is " + Math.round(distance) / 1000 + " km");
    console.log("Player got " + points + " points");

    res.json({
        distance: distance,
        points: points
    });
});

server.get('/randomChallenge', function (req, res) {
    var index = Math.trunc(Math.random() * ChallengeData.cities.length);
    
    res.json({
        name: ChallengeData.cities[index].name,
        id: index
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

server.post('/signup', function(req, res){
    var body = req.body;

    loginController.SignUp(body.email, body.passHash, function(message){
        res.json({
            success: message.success
        })
    });
});

server.post('/login', function(req, res){
    var body = req.body;

    var email = body.email;
    var passHash = body.passHash;

    loginController.LogIn(email, passHash, tokenTimeout, function(message){
        res.json({
            success: message.success,
            token: message.token
        });
    });
});

server.get('/verifyAccount/:hash', function(req, res){
    var hash = req.params.hash;

    loginController.Verify(hash, function(message){
        res.json({
            success: message.success 
        });
    });
});

server.get('/getAllAccounts', function(req, res){

    li.FindAll(function(success, docs){
        if(success){
            res.json({
                success: true,
                docs: docs
            });
        }
        else{
            res.json({
                success: false,
                docs: []
            });
        }
    });
});

server.listen(4300);