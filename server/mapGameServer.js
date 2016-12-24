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

function calculateDistance(lat1, lng1, lat2, lng2) {
    var earthRadius = 6371000;

    //Transpose to cartesian coordinates
    var y1 = earthRadius * Math.sin(toRadians(lat1));
    var y2 = earthRadius * Math.sin(toRadians(lat2));

    var x1 = earthRadius * Math.cos(toRadians(lat1)) * Math.sin(toRadians(lng1));
    var x2 = earthRadius * Math.cos(toRadians(lat2)) * Math.sin(toRadians(lng2));

    var z1 = earthRadius * Math.cos(toRadians(lat1)) * Math.cos(toRadians(lng1));
    var z2 = earthRadius * Math.cos(toRadians(lat2)) * Math.cos(toRadians(lng2));

    //Calculate cartesian distance
    var cartDist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) + Math.pow((z1 - z2), 2));

    //Calculate angle
    var angle = 2 * Math.asin((cartDist / 2) / earthRadius);

    //Calculate circular distance
    return angle * earthRadius;
}

function calculatePoints(distance, time) {
    return distance / time;
}

function toRadians(angle) {
    return 2 * Math.PI * angle / 360;
}

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