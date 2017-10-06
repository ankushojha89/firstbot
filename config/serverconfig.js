//local files
const config = require('./config.json');
var ibmSetupKey = require('./ibm_config.json');
var myLabSetup = require('./mylab_config.json');

const ConversationV1 = require('watson-developer-cloud/conversation/v1');

const MongoClient = require('mongodb').MongoClient;


process.env.NODE_ENV=process.env.NODE_ENV||config.server.environment;
console.log("ENV**************",process.env.NODE_ENV);

// ibm watson setup 
process.env.WATSON_USERNAME=process.env.WATSON_USERNAME||ibmSetupKey.myIbm.username;
process.env.WATSON_PASSWORD=process.env.WATSON_PASSWORD||ibmSetupKey.myIbm.password;
process.env.WATSON_WORKSPACE_ID=process.env.WATSON_WORKSPACE_ID||ibmSetupKey.myIbm.workspace_id;
process.env.WATSON_VERSION_DATE=process.env.WATSON_VERSION_DATE||ibmSetupKey.myIbm.version_date;

console.log("Set up for WATSON Conversation service wrapper for version dated : ",process.env.WATSON_VERSION_DATE); 

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
    username: process.env.WATSON_USERNAME, 
    password: process.env.WATSON_PASSWORD,
    path: { workspace_id: process.env.WATSON_WORKSPACE_ID },
    version_date: process.env.WATSON_VERSION_DATE
  });



/**************************************************************/
/** * Database setup */
/**************************************************************/
var state = {
  db: null,
  jobDomain:null,
  applicant:null
}
var options ={ 
    reconnectTries: 30,
    poolSize: 5   
}
//mongodb://<dbuser>:<dbpassword>@ds147034.mlab.com:47034/employeedb

const MLAB_DBUSER=process.env.MLAB_DBUSER||myLabSetup.database.username;
const MLAB_DBPASSWORD=process.env.MLAB_DBPASSWORD||myLabSetup.database.password;

process.env.MONGODB_URI=`${myLabSetup.database.dbType}://${MLAB_DBUSER}:${MLAB_DBPASSWORD}@${myLabSetup.database.hostname}:${myLabSetup.database.port}/${myLabSetup.database.databasename}`;

connect = function(done) {
  if (state.db) return done()
  MongoClient.connect(process.env.MONGODB_URI,options, function(err, db) {
    if(err) {     
      console.log(`Mongodb connection error on ${process.env.MONGODB_URI}`);
      console.log(err);         
      process.exit(0); 
    }
    console.log(`Successfully connected to the database ${process.env.MONGODB_URI}`);
    state.db = db;
    state.jobDomain = db.collection(myLabSetup.database.tableName);
    state.applicant=db.collection(myLabSetup.database.tableName2);
    done()
  })
}
get = function() {
  return state.db;
 }

collectionJobDomain = function() {
  return state.jobDomain;
 }
 collectionApplicant = function() {
  return state.applicant;
 }
// export
module.exports = {config,conversation,connect,get,collectionJobDomain,collectionApplicant};
