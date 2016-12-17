var fs = require('fs');
var new_sessision = {"userID":0, "messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***", "pic":""};

// writeFileSync
var active_sessions = [];

var arquivo = fs.readFileSync(__dirname + "/tmp/session").toString();
active_sessions = JSON.parse(arquivo);
//console.log(active_sessions);

module.exports = {
  addSession: function(userID){
  	var new_sessision = {"userID":0, "messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***", "pic":""};
    active_sessions.push(new_sessision);
    fs.writeFileSync(__dirname + "/tmp/session", JSON.stringify(active_sessions));
  },

  getSession: function(userID){

    var retorno = undefined;
    console.log("Recuperando sessao");
  //  console.log("Tamanho array = "+active_sessions.length)
    for (var i = active_sessions.length - 1; i >= 0; i--) {
      var temp = active_sessions[i];

      if(temp.userID == userID){
        retorno  = temp;
        break;
      }else{
        console.log("temp.userID != userID " + temp.userID + " != " + userID);
      }
    }
    console.log("Retornando getSession = "+ retorno);
    return retorno;
  },
  updateSession: function(userID, messageCount, userAnswerYes, opcoesEnviadas, pic){

   
    var up_sessision = {"userID":userID, "messageCount":messageCount, "userAnswerYes":userAnswerYes, "opcoesEnviadas": opcoesEnviadas, "pic":pic};

    for (var i = active_sessions.length - 1; i >= 0; i--) {
      var temp = active_sessions[i];

      if(temp.userID == userID){
        active_sessions.splice(i);
        break;
      }
    }
    active_sessions.push(up_sessision);
    fs.writeFileSync(__dirname + "/tmp/session", JSON.stringify(active_sessions));
  }, 
  listSession: function(){
     for (var i = active_sessions.length - 1; i >= 0; i--) {
      var temp = active_sessions[i];

      console.log("{ "+temp.userID + " " +  temp.messageCount + " " + temp.userAnswerYes + " " + temp.opcoesEnviadas + " " + temp.pic +" }");
    }
  }, resetSession: function(userID){
    var new_sessision = {"userID":0, "messageCount":0, "userAnswerYes":"***", "opcoesEnviadas": "***", "pic":""};

   for (var i = active_sessions.length - 1; i >= 0; i--) {
      var temp = active_sessions[i];

      if(temp.userID == userID){
        active_sessions.splice(i);
        break;
      }
    }
    active_sessions.push(new_sessision);
    fs.writeFileSync(__dirname + "/tmp/session", JSON.stringify(active_sessions));
  }
};
