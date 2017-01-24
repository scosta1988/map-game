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

function StartChallenge(userId, challengeId, cb){
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
                cb(newChallenge.NextCity());
            }
        });
    }
}

function SyncTimeout(userId){
    var challenge = GetChallengeByUserId(userId);
    if(challenge == null){
        return({
            ErrCode: ErrorCodes.NotFound,
            CityId: 0,
            Timeout: 0
        });
    }
    else{
        cb(challenge.SyncTimeout());
    }
}

function CityGuess(userId, lat, lng){
    var challenge = GetChallengeByUserId(userId);
    if(challenge == null){
        return({
            ErrCode: ErrorCodes.NotFound,
            Points: 0,
            Distance: 0,
            Lat: 0,
            Lng: 0
        });
    }
    else{
        if(lat < -90 || lat > 90 || lng < -180 || lng > 180){
            return({
                ErrCode: ErrorCodes.WrongParams,
                Points: 0,
                Distance: 0,
                Lat: 0,
                Lng: 0
            });
        }
        else{
            cb(challenge.CityGuess(lat, lng));
        }
    }
}

function NextCity(userId){
    var challenge = GetChallengeByUserId(userId);

    if(challenge == null){
        return({
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
        cb(challenge.NextCity());
    }
}

function GetFinalScore(userId, cb){
    var challenge = GetChallengeByUserId(userId);

    if(challenge == null){
        cb({
            ErrCode: ErrorCodes.NotFound,
            Points: 0,
            Grade: 0,
            Ranks: {}
        });
    }
    else{
        challenge.GetFinalScore(function(result){
            cb(result);
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

//Generic
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

//Class
function ChallengeController(userId, challengeModel){
    var model = challengeModel;
    var userId = userId;
    var currentCity = challengeModel.listOfCities[0];
    var currentTimeout = 0;
    var score = {
        overallScore: 0,
        individualScore: []
    }
    var challengeEnded = false;

    var challengeSyncInterval = setInterval(function(){
        
    }, 1000);

    challengeArray.push(this);

    function EndChallenge(){
        this.challengeEnded = true;
    }
}

//Publics
ChallengeController.prototype.CityGuess = function(lat, lng){
    var currentCity = this.currentCity;

    if(currentCity == null){
        return({
            ErrCode: ErrorCodes.Timeout,
            Points: 0,
            Distance: 0,
            Lat: 0,
            Lng: 0
        });
    }
    else{
        var distance = calculateDistance(lat, lng, currentCity.lat, currentCity.lng);
        var points = calculatePoints(distance);

        this.score.overallScore += points;
        this.score.individualScore.push(points);

        return({
            ErrCode: ErrorCodes.OK,
            Points: points,
            Distance: distance,
            Lat: currentCity.lat,
            Lng: currentCity.lng
        });
    }
}

ChallengeController.prototype.SyncTimeout = function(){
    var currentCity = this.currentCity;
    if(currentCity == null){
        return({
            ErrCode: ErrorCodes.Timeout,
            CityId: 0,
            Timeout: 0
        });
    }
    else{
        return({
            ErrCode: ErrorCodes.OK,
            CityId: currentCity._id,
            Timeout: this.currentTimeout
        });
    }
}

ChallengeController.prototype.NextCity = function(){
    if(this.challengeEnded){
        return({
            ErrCode: ErrorCodes.EndChallenge,
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
        var currentCity = this.currentCity;
        if(currentCity == null){
            return({
                ErrCode: ErrorCodes.Cooldown,
                City: {},
                Timeout: this.currentTimeout,
                MapCentering: {
                    lat: 0,
                    lng: 0,
                    zoom: 0
                }
            });
        }
        else{
            return({
                ErrCode: ErrorCodes.OK,
                City: currentCity,
                Timeout: this.currentTimeout,
                MapCentering: {
                    lat: 0,
                    lng: 0,
                    zoom: 0
                }
            });
        }
    }
}

ChallengeController.prototype.GetFinalScore = function(cb){
    if(!this.challengeEnded){
        cb({
            ErrCode: ErrorCodes.ChallengeOngoing,
            Points: 0,
            Grade: 0,
            Ranks: 0
        });
    }
    else{
        cb({
            ErrCode: ErrorCodes.OK,
            Points: this.score.overallScore,
            Grade: 0,
            Ranks: 0
        })
    }
}

module.exports.ChallengeInfo = ChallengeInfo;
module.exports.StartChallenge = StartChallenge;
module.exports.SyncTimeout = SyncTimeout;
module.exports.CityGuess = CityGuess;
module.exports.NextCity = NextCity;
module.exports.GetFinalScore = GetFinalScore;
module.exports.GetChallengeByUserId = GetChallengeByUserId;