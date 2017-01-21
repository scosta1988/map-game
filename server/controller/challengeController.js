var challengeArray = [];

function ChallengeController(userId, challengeModel){
    var model = challengeModel;
    var userId = userId;

    challengeArray.push(this);
}

ChallengeController.prototype.CityGuess = function(){

}

ChallengeController.prototype.StartChallenge = function(){

}

ChallengeController.prototype.ChallengeInfo = function(){

}

ChallengeController.prototype.GetChallengeArray = function(){
    return challengeArray;
}

module.exports = ChallengeController;