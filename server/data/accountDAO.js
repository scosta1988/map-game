var mongo = require('mongodb').MongoClient;
var DataConstants = require('./dataConstants');

var AccountDAO = {
    Create: function (email, name, token, userId, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false, null);
            }
            else {
                var toInsert = {
                    email: email,
                    name: name,
                    token: token,
                    userId: userId,
                    picture: "",
                    achievements: [],
                    history: [],
                    friends: []
                }

                db.collection(DataConstants.Collections.ACCOUNT)
                    .insertOne(toInsert, function (err, r) {
                        db.close();
                        if (err != null)
                            cb(false, null)
                        else
                            cb(true, r.insertedId);
                    });
            }

        });
    },

    RemoveByEmail: function(email, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toRemove = {
                    email: email
                }

                db.collection(DataConstants.ACCOUNT)
                    .deleteOne(toRemove, function(err, r){
                        db.close();
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
    RemoveByToken: function(token, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toRemove = {
                    token: token
                }

                db.collection(DataConstants.ACCOUNT)
                    .deleteOne(toRemove, function(err, r){
                        db.close();
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
    RemoveByUserId: function(userId, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                var toRemove = {
                    userId: userId
                }

                db.collection(DataConstants.ACCOUNT)
                    .deleteOne(toRemove, function(err, r){
                        db.close();
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
    Update: function(email, name, token, userId, picture, achievements, history, friends, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false);
            }
            else{
                var toUpdate = {
                    email: email,
                    name: name,
                    token: token,
                    userId: userId,
                    picture: picture,
                    achievements: achievements,
                    history: history,
                    friends: friends
                };

                db.collection(DataConstants.ACCOUNT)
                    .updateOne({email: email}, {$set: toUpdate}, function(err, r){
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
    FindByEmail: function(email, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.ACCOUNT)
                    .find({email: email}).limit(1).next(function(err, doc){
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
    FindByToken: function(token, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.ACCOUNT)
                    .find({token: token}).limit(1).next(function(err, doc){
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
    FindByUserId: function(userId, cb){
        mongo.connect(DataConstants.DB_URL, function(err, db){
            if(err != null){
                cb(false, null);
            }
            else{
                db.collection(DataConstants.ACCOUNT)
                    .find({userId: userId}).limit(1).next(function(err, doc){
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
};

module.exports = AccountDAO;