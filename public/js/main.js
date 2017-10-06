var bot = {};
bot.avatar = "https://az705183.vo.msecnd.net/dam/skype/media/concierge-assets/avatar/avatarcnsrg-800.png";

var user = {};
user.avatar = "https://www.ukvoipforums.com/styles/FLATBOOTS/theme/images/user4.png";

var context;

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "bot"){
        
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="rounded-circle" style="width:100%;" src="'+ bot.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="rounded-circle" style="width:100%;" src="'+user.avatar+'" /></div>' +                                
                  '</li>';
    }
                    
     $("ul").append(control);   
    $("ul").animate({scrollTop: $("ul").prop("scrollHeight")}, 500);
     
}
// reset chat
function resetChat(){
    $("ul").empty();
}
// call chat bot
function startBotTalk(){
    $.ajax({
        type: "GET",
        url: '/botapi',    
        success: function(res) {
            console.log(res);          
            // Send back the context to maintain state.
            context= res.response.context;
            insertChat("bot", res.response.output.text[0]);         
        },
        error: function( error )
        {
            insertChat("bot", "Unable to connect server");
        }
    });
}

// call chat bot   firststepbot
function botTalk(message){

    var postData={context,message};
    insertChat("user", message); 
    $.ajax({
        type: "POST",
        url: '/botapi',   
        dataType: 'json',
        data: JSON.stringify(postData), 
        success: function(res) {
            
            console.log(res);          
            // Send back the context to maintain state.
            context= res.response.context;
            
            
            if(res.response.output.jobList==true){       
                console.log(res.response.output.allJobLists);
                insertChat("bot", res.response.output.allJobLists);
            }
            insertChat("bot", res.response.output.text[0]);

        },
        error: function( error )
        {
            insertChat("bot", "Unable to connect server");
        }
  
    });
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){             
            botTalk(text);
            $(this).val('');           
        }
    }
});



//-- Print Messages
//insertChat("bot", "Hello testing...");  
//insertChat("user", "Hi, test");

//-- NOTE: No use time on insertChat.

$(function() {
    console.log( "ready!" );
    //-- Clear Chat
    resetChat();
    startBotTalk();
});