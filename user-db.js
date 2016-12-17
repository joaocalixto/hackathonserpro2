var fs = require('fs');
var Firebase = require("firebase");
var new_sessision = {"userID":0, "messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***"};
//var query = ref.orderByChild("timestamp").limitToLast(100);


// writeFileSync

var myFirebaseRef = new Firebase("https://user-face.firebaseio.com/users");


var active_sessions = [];



module.exports = {
  addSession: function(userID, userPic){

  	//var new_sessision = userID:{"messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***"};
    var userIdStr = userID;
    console.log("userId " + userID);

   // var usersRef = ref.child("users");

        myFirebaseRef.child(userID).set({
          "messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***", "pic":userPic
        });
      
  },
  getSession: function(userPic, callback){

    //var new_sessision = userID:{"messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***"};

    var retorno = []
    myFirebaseRef.orderByValue().on("value", function(snapshot) {
                                  snapshot.forEach(function(data) {
                                    var pic = data.val().pic;
                                    var idTemp = pic.split("_")[1];
                                    if(pic != undefined){

                                      for (var i = 0; i < userPic.length; i++) {
                                        var userPicTemp = userPic[i].pic.split("_")[1];
                                        //console.log("idTemp = " + idTemp)
                                        //console.log("userPicTemp = " + userPicTemp)
                                        if(idTemp == userPicTemp){
                                          console.log("usuario Encontrado")
                                          retorno.push(data.key())
                                          break  
                                        }
                                      };
                                    }
                                    // console.log("The " + data.key() + " dinosaur's score is " + data.val().pic);
                                  });
                                  callback(retorno);
                                });    
  }
};
