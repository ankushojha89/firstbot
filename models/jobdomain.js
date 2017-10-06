const {collectionJobDomain} = require('./../config/serverconfig');
const {ObjectID}=require('mongodb');

exports.all = function(cb) {     
    collectionJobDomain().find().sort( { updatedAt: -1 } ).toArray(function(err, docs) {
      cb(err, docs);      
    })
}

 