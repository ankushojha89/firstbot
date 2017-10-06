const {collectionApplicant} = require('./../config/serverconfig');


exports.save = function(body,cb) {     
   collectionApplicant().insertOne(body,function (error, response) {    
        cb(error, response.ops[0]);
    });
}
 

exports.findById = function(id,cb) {     
    collectionApplicant().findOne({applicantId: Number(id)},function(err, result) {        
      cb(err, result);
    });
}