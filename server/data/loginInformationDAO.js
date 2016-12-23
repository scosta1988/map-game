var mongo = require('mongodb').MongoClient;
var DataConstants = require('./dataConstants');

var LoginInformationDAO = {
    Create: function (email, passHash, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false, null);
            }
            else {
                var toInsert = {
                    email: email,
                    passHash: passHash,
                    token: "",
                    lastAccess: 0,
                    verified: false
                }

                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
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

    Update: function (email, passHash, token, verified, lastAccess, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false);
            }
            else {
                var toUpdate = {
                    email: email,
                    passHash: passHash,
                    token: token,
                    lastAccess: lastAccess,
                    verified: verified
                }

                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
                    .updateOne({ email: email }, { $set: toUpdate }, function (err, r) {
                        db.close();
                        if (err != null)
                            cb(false)
                        else
                            cb(true);
                    });
            }
        });
    },

    Remove: function (email, passHash, token, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false);
            }
            else {
                var toRemove = {
                    email: email,
                    passHash: passHash,
                    token: token
                }

                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
                    .deleteOne(toRemove, function (err, r) {
                        db.close();
                        if (err != null)
                            cb(false)
                        else
                            cb(true);
                    });
            }
        });
    },
    
    FindAll: function (cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false, []);
            }
            else {
                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
                    .find({}).toArray(function (err, docs) {
                        db.close();
                        if (err != null)
                            cb(false, [])
                        else
                            cb(true, docs);
                    });
            }
        });
    },

    FindByEmail: function (email, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false, []);
            }
            else {
                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
                    .find({ email: email }).limit(1).toArray(function (err, docs) {
                        db.close();
                        if (err != null || docs.length == 0)
                            cb(false, [])
                        else
                            cb(true, docs[0]);
                    });
            }
        });
    },

    FindByToken: function (token, cb) {
        mongo.connect(DataConstants.DB_URL, function (err, db) {
            if (err != null) {
                cb(false, []);
            }
            else {
                db.collection(DataConstants.Collections.LOGIN_INFORMATION)
                    .find({ token: token }).limit(1).toArray(function (err, docs) {
                        db.close();
                        if (err != null || docs.length == 0)
                            cb(false, [])
                        else
                            cb(true, docs[0]);
                    });
            }
        });
    }
};

module.exports = LoginInformationDAO;