//config files
const {conversation} = require('./../config/serverconfig');
const  JobDomain=require('./../models/jobdomain');
const  Applicant=require('./../models/applicant');
const  _=require('lodash');
var express = require('express');
var router = express.Router();


/* Start Bot using GET method. */
router.get('/', function(req, res, next) {   
    
    conversation.message({}, (err, response)=>{
        console.log(JSON.stringify(response,undefined,2));
        if (err) {
            // console.error(err); // something went wrong
            console.log(JSON.stringify(err,undefined,2));     
             return res.status(400).send({messages:"Error"});
           }
           res.status(200).send({response});
    });       
});

/* Talking Bot using Post method. */
router.post('/', function(req, res, next) {  
  
    var str;
    Object.keys(req.body).forEach(function(key) {
        str=key;       
    });
    
    conversation.message({
        input: { text: JSON.parse(str).message },
        // Send back the context to maintain state.
        context : JSON.parse(str).context ,
      }, (err, response)=>{
     
        if (err) {
            // console.error(err); // something went wrong
            console.log(JSON.stringify(err,undefined,2));     
             return res.status(400).send({messages:"Error"});
           }

       if (response.output.jobList == true) {       
                JobDomain.all(function(dberr, allJobLists) {
                if(dberr){                    
                    dberr.message='Error in getting all employees list';
                    dberr.status = 400; 
                    console.log(dberr);   
                } 

                var jobData='Currently avaliable jobs are ';
                Object.keys(allJobLists).forEach(function(key,index) {    
                       
                    if(index==allJobLists.length-1){
                        jobData+=allJobLists[key].name+'. ';
                    }else                    
                    jobData+=allJobLists[key].name+' or ';
                });
                
                response.output.allJobLists= jobData;
                console.log(JSON.stringify(response,undefined,2));
              return  res.status(200).send({response});
            })
        }else if(response.output.applicantSave==true){

            console.log('..........................');
            var body={
                applicantId:Number(new Date()),
                mobile:response.context.applicantMobile,
                name:response.context.applicant,
                time:response.context.time,
                expriences:response.context.applicantExp,
                currentPosition:response.context.applicantPosition,
                PositionForApplied:response.context.jobPosition ,
                applicationStatus:"Applied" 
            };
            delete response.context.applicantMobile;
            delete response.context.applicant;
            delete response.context.time;
            delete response.context.applicantExp;
            delete response.context.jobPosition;
            delete response.context.applicantPosition;

            Applicant.save(body,(errApp, applicant)=>{
                if(errApp){
                    errApp.message='Error in creation of new employee';
                    console.log(errApp);               
                }     
                response.output.text[0]+=` and your applicant id is ${applicant.applicantId}. Save for future refrence.`;                       
                console.log(JSON.stringify(response,undefined,2));
                return  res.status(200).send({response});
        }); 
        }else if(response.output.applicantId!=null){

            console.log(response.output.applicantId);

            Applicant.findById(response.output.applicantId,(errFindId,applicant)=>{
                if(errFindId){
                    errFindId.message='No application found';
                    console.log(errFindId);  
                }    
                else if(!applicant){  
                    response.output.text[0]=` No application found for ${response.output.applicantId}`;    
                } else{
                    response.output.text[0]=` your application status is  ${applicant.applicationStatus}`;    
                }                
                console.log(JSON.stringify(response,undefined,2));
                return  res.status(200).send({response});
                
        });
        }
        else{
            console.log(JSON.stringify(response,undefined,2));
            res.status(200).send({response});
        }

                
    }); 

});






// Process the conversation response.
function processResponse(err, response) {
    
      console.log(JSON.stringify(response,undefined,2));
      
    
      if (err) {
       // console.error(err); // something went wrong
       console.log(JSON.stringify(err,undefined,2));

        return;
      }
    
      var endConversation = false;
      if (response.entities.entity === 'Location') {
       console.log(response.entities.value);
      }
      
      console.log(response.output.action,'//////////////');
      // Check for action flags.
      if (response.output.action === 'display_time') {
       
        // User asked what time it is, so we output the local system time.
        console.log('The current time is ' + new Date().toLocaleTimeString());
      } else if (response.output.action === 'end_conversation') {
        // User said goodbye, so we're done.
        console.log(response.output.text[0]);
        endConversation = true;
      } else {
        // Display the output from dialog, if any.
        if (response.output.text.length != 0) {
            console.log(response.output.text[0]);
        }
      }
    
      // If we're not done, prompt for the next round of input.
    //   if (!endConversation) {
    //     var newMessageFromUser = prompt('>> ');
    //     conversation.message({
    //       input: { text: newMessageFromUser },
    //       // Send back the context to maintain state.
    //       context : response.context,
    //     }, processResponse)
    //   }
    }










 module.exports = router;