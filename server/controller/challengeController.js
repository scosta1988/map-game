var ChallengeDAO = require('../data/challengeDAO');

var challengeArray = [];

var ErrorCodes = {
    OK: 200,
    Timeout: 202,
    Cooldown: 203,
    EndChallenge: 204,
    ChallengeOngoing: 400,
    NotFound: 404,
    WrongParams: 500,
    Forbidden: 503
}

//Statics
function ChallengeInfo(userId, challengeId, cb){
    ChallengeDAO.FindById(challengeId, function(success, challenge){
        if(!success){
            cb({
                ErrCode: ErrorCodes.NotFound,
                ChallengeModel: {}
            });
        }
        else{
            cb({
                ErrCode: ErrorCodes.OK,
                ChallengeModel: {
                    Name: challenge.name,
                    Description: challenge.description,
                    NumOfCities: challenge.listOfCities.length,
                    Ranks: [],
                    PicturesURLs: []
                }
            })
        }
    });
}

function StartChallenge(userId, challengeId){
    if(GetChallengeByUserId != null){
        cb({
            ErrCode: ErrorCodes.ChallengeOngoing,
            City: {},
            Timeout: 0,
            MapCentering: {
                lat: 0,
                lng: 0,
                zoom: 0
            }
        });
    }
    else{
        ChallengeDAO.FindById(challenge, function(success, challenge){
            if(!success){
                cb({
                    ErrCode: ErrorCodes.NotFound,
                    City: {},
                    Timeout: 0,
                    MapCentering: {
                        lat: 0,
                        lng: 0,
                        zoom: 0
                    }
                });
            }
            else{
                var newChallenge = new ChallengeController(userId, challenge);
                cb({
                    ErrCode: ErrorCodes.OK,
                    City: newChallenge.currentCity,
                    Timeout: newChallenge.currentTimeout,
                    MapCentering: {
                        lat: 0,
                        lng: 0,
                        zoom: 0
                    }
                });
            }
        });
    }
}

function GetChallengeByUserId(userId){
    var challenge = challengeArray.filter(function(value, index, array){
        if(value.userId == userId){
            return true;
        }
        else{
            return false;
        }
    });

    if(challenge.length < 0){
        return null;
    }
    else{
        return challenge[0];
    }
}

//Privates
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

function calculatePoints(distance, timeout) {
    return distance * timeout;
}

function toRadians(angle) {
    return 2 * Math.PI * angle / 360;
}

function EndChallenge(userId){

}

//Class
function ChallengeController(userId, challengeModel){
    var model = challengeModel;
    var userId = userId;
    var currentCity = challengeModel.listOfCities[0];
    var currentTimeout = 0;
    var challengeSyncInterval = setInterval(this.SyncIntervalCallback, 1000);

    var score = {
        overallScore: 0,
        individualScore: []
    }

    challengeArray.push(this);
}

//Publics
ChallengeController.prototype.CityGuess = function(lat, lng){
    var distance = calculateDistance(lat, lng, this.currentCity.lat, this.currentCity.lng);
    var points = calculatePoints(distance);

    return({
        distance: distance,
        points: points
    });
}

ChallengeController.prototype.SyncTimeout = function(){
    return this.currentTimeout;
}

ChallengeController.prototype.NextCity = function(){

}

ChallengeController.prototype.SyncIntervalCallback = function(){

}

module.exports.ChallengeInfo = ChallengeInfo;
module.exports.StartChallenge = StartChallenge;
module.exports.GetChallengeByUserId = GetChallengeByUserId;