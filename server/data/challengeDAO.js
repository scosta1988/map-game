var mongo = require('mongodb').MongoClient;
var DataConstants = require('./dataConstants');

var ChallengeDAO = {
    Create: function(name, listOfCities, description, picturesUrls, ranks, grades, timeout, cooldown, mapCentering, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toCreate = {
                    name: name,
                    listOfCities: listOfCities,
                    description: description,
                    picturesUrls: picturesUrls,
                    ranks: ranks,
                    grades: grades,
                    timeout: timeout,
                    cooldown: cooldown,
                    mapCentering: mapCentering
                }

                db.collection(DataConstants.Collections.CHALLENGE)
                    .insertOne(toCreate, function(err, r){
                        if(err != null){
                            cb(false, null);
                        }
                        else{
                            cb(true, r.insertedId);
                        }
                    });
            }
        });
    },
    Remove: function(id, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toRemove = {
                    _id: id
                }

                db.collection(DataConstants.Collections.CHALLENGE)
                    .deleteOne(toRemove, function(err, r){
                        if(err != null){
                            cb(false, null);
                        }
                        else{
                            cb(true, r.deletedCount);
                        }
                    });
            }
        });
    },
    Update: function(id, name, listOfCities, description, picturesUrls, ranks, grades, timeout, cooldown, mapCentering, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false);
            }
            else{
                var toUpdate = {
                    name: name,
                    listOfCities: listOfCities,
                    description: description,
                    picturesUrls: picturesUrls,
                    ranks: ranks,
                    grades: grades,
                    timeout: timeout,
                    cooldown: cooldown,
                    mapCentering: mapCentering
                }

                db.collection(DataConstants.Collections.CHALLENGE)
                    .updateOne({_id: id}, {$set: toUpdate}, function(err, r){
                        if(err != null){
                            cb(false);
                        }
                        else{
                            cb(true);
                        }
                    });
            }
        });
    },
    FindByName: function(name, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.Collections.CHALLENGE)
                    .find({name: name}).limit(1).next(function(err, doc){
                        if(err != null){
                            cb(false, null);
                        }
                        else{
                            cb(true, doc);
                        }
                    });
            }
        });
    },
    FindById: function(id, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.Collections.CHALLENGE)
                    .find({_id: id}).limit(1).next(function(err, doc){
                        if(err != null){
                            cb(false, null);
                        }
                        else{
                            cb(true, doc);
                        }
                    });
            }
        });
    },
    UpdateRanks: function(id, ranks, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false);
            }
            else{
                var toUpdate = {
                    ranks: ranks
                }

                db.collection(DataConstants.Collections.CHALLENGE)
                    .updateOne({_id: id}, {$set: toUpdate}, function(err, r){
                        if(err != null){
                            cb(false);
                        }
                        else{
                            cb(true);
                        }
                    });
            }
        });
    }
};

module.exports = ChallengeDAO;