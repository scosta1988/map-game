var SHA256 = require('crypto-js/sha256');

var Utils = {
    Sha256ToHexString: function (sha256) {
        var result = "";
        sha256.words.forEach(function(element, index, array){
            var hex = (element >>> 0).toString(16);
            while(hex.length < 8){
                hex = "0" + hex;
            }

            result += hex;
        });

        return result;
    },

    StringToHexSha256: function(string) {
        var sha256 = SHA256(string);
        return Utils.Sha256ToHexString(sha256);
    }
};

module.exports = Utils;