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
    if(GetChallengeByUserId(userId) != null){
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
        ChallengeDAO.FindById(challengeId, function(success, challenge){
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
        return(challenge.SyncTimeout());
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
            return challenge.CityGuess(lat, lng);
        }
    }
}

function NextCity(userId){
    var challenge = GetChallengeByUserId(userId);

    if(challenge == null){
        return({
            ErrCode: ErrorCodes.NotFound,
            CityName: "",
            Timeout: 0,
            MapCentering: {
                lat: 0,
                lng: 0,
                zoom: 0
            }
        });
    }
    else{
        return(challenge.NextCity());
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
        if(value.GetUserId() == userId){
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

function calculatePoints(distance, range, timeout) {
    if(distance - range <= 0.001){
        //Bull's Eye
        distance = 0.001;
    }
    return timeout / distance;
}

function toRadians(angle) {
    return 2 * Math.PI * angle / 360;
}

//Class
function ChallengeController(userId, challengeModel){
    this.userId = userId;
    this.listOfCities = challengeModel.listOfCities;
    this.currentCity = challengeModel.listOfCities[0];
    this.progress = 0;
    this.timeout = challengeModel.timeout;
    this.cooldown = challengeModel.cooldown;

    this.currentTimeout = challengeModel.timeout;
    this.score = {
        overallScore: 0,
        individualScore: []
    }

    this.challengeEnded = false;

    this.challengeSyncInterval = setInterval(function(){
        this.currentTimeout--;
        console.log(this.userId + " Challenge - City: " + (this.currentCity ? this.currentCity.name : "") + " - Timeout: " + this.currentTimeout);
        if(this.currentTimeout == 0){
            if(this.currentCity == null){
                this.currentCity = this.listOfCities[this.progress];
                this.currentTimeout = this.timeout;
            }
            else{
                this.progress++;
                if(this.progress < this.listOfCities.length){
                    this.currentCity = null;
                    this.currentTimeout = this.cooldown;
                }
                else{
                   this.EndChallenge();
                }
            }
        }
    }.bind(this), 1000);

    challengeArray.push(this);

    this.EndChallenge = function(){
        clearInterval(this.challengeSyncInterval);
        this.challengeEnded = true;
        setTimeout(function(){
            var index = challengeArray.indexOf(this, 0);
            challengeArray.splice(index, 1);
        }.bind(this), 10000)
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
        var points = calculatePoints(distance, currentCity.range, this.currentTimeout);

        this.score.overallScore += points;
        this.score.individualScore.push(points);

        this.progress++;
        if(this.progress < this.listOfCities.length){
            this.currentCity = null;
            this.currentTimeout = this.cooldown;
        }
        else{
            this.EndChallenge();
        }

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
            CityName: "",
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
                CityName: "",
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
                CityName: currentCity.name,
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

//Uses a Callback as return due to a future fetching of the ranks
ChallengeController.prototype.GetFinalScore = function(cb){
    if(!this.challengeEnded){
        cb({
            ErrCode: ErrorCodes.ChallengeOngoing,
            Points: 0,
            Grade: 0,
            Ranks: []
        });
    }
    else{
        cb({
            ErrCode: ErrorCodes.OK,
            Points: this.score.overallScore,
            Grade: 0,
            Ranks: []
        })
    }
}

ChallengeController.prototype.GetUserId = function(){
    return this.userId;
}

module.exports.ChallengeInfo = ChallengeInfo;
module.exports.StartChallenge = StartChallenge;
module.exports.SyncTimeout = SyncTimeout;
module.exports.CityGuess = CityGuess;
module.exports.NextCity = NextCity;
module.exports.GetFinalScore = GetFinalScore;
module.exports.GetChallengeByUserId = GetChallengeByUserId;