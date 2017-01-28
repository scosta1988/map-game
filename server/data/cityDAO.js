var mongo = require('mongodb').MongoClient;
var DataConstants = require('./dataConstants');

var CityDAO = {
    Create: function(name, lat, lng, range, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toInsert = {
                    name: name,
                    lat: lat,
                    lng: lng,
                    range: range
                }

                db.collection(DataConstants.Collections.CITY)
                    .insertOne(toInsert, function(err, r){
                        db.close();
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
        mongo.connect(DataConstants.DB_URL, function(err,db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toRemove = {
                    _id: id
                }

                db.collection(DataConstants.Collections.CITY)
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
    Update: function(id, name, lat, lng, range){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false);
            }
            else{
                var toUpdate = {
                    name: name,
                    lat: lat,
                    lng: lng,
                    range: range
                }

                db.collection(DataConstants.Collections.CITY)
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
    FindById: function(id, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.Collections.CITY)
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
    FindByName: function(name, cb){
        console.log("CityDAO:FindByName: " + name);
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                console.log("CityDAO:FindByName: Error");
                cb(false, null);
            }
            else{
                db.collection(DataConstants.Collections.CITY)
                    .find({name: name}).limit(1).next(function(err, doc){
                        if(err != null){
                            console.log("CityDAO:FindByName: Error");
                            cb(false, null);
                        }
                        else{
                            console.log("CityDAO:FindByName: OK");
                            cb(true, doc);
                        }
                    });
            }
        });
    }
};

module.exports = CityDAO;