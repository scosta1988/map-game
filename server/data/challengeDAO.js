var mongo = require('mongodb').MongoClient;
var DataConstants = require('./dataConstants');
var CityDAO = require('./cityDAO');
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

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
                            var cityList = [];
                            doc.listOfCities.forEach(function(element) {
                                CityDAO.FindByName(element, function(success, city){
                                    if(success){
                                        cityList.push(city);
                                    }
                                });
                            }, this);

                            doc.listOfCities = cityList;
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
                    .find({_id: ObjectID(id)}).limit(1).next(function(err, doc){
                        if(err != null || doc == null){
                            cb(false, null);
                        }
                        else{
                            //synchronization
                            var calls = [];

                            var cityList = [];
                            doc.listOfCities.forEach(function(element) {
                                calls.push(function(callback){
                                    CityDAO.FindByName(element, function(success, city){
                                        if(success){
                                            cityList.push(city);
                                            callback(null);
                                        }
                                    });
                                });
                                
                            });

                            async.parallel(calls, function(err, result) {
                                doc.listOfCities = cityList;
                                cb(true, doc);
                            });
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