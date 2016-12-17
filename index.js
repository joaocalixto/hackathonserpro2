var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var messageUtil = require("./messageUtil");
var sessionUtil = require("./sessionUtil");
var users = require("./user-db");
var messenger = require("./messengerBot-api");

var email = require("./services/send_email");


var app = express()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.set("port", (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// Process application/json
app.use(bodyParser.json());


// Index route
app.get("/", function(req, res) {
  res.send("Hello world, I am a chat bot!")
});

// for Facebook verification
app.get("/webhook/", function(req, res) {
  if (req.query["hub.verify_token"] === "token1234") {
    res.send(req.query["hub.challenge"])
  }
  res.send("Error, wrong token")
});

app.get("/sendNotification/", function(req, res) {
  var sender = "239889206376149"
  messenger.sendTextMessage(sender, " Seu saiu para entrega. Obrigado.", token);
});



var messageCount = 0;
var userAnswerYes = "***";
var opcoesEnviadas = "***";
var session = undefined;
var userPic = ""

function iniciarBot() {
  messageCount = 0;
  userAnswerYes = "***";
  opcoesEnviadas = "***";
  userPic = "";
  console.log("Entrou == iniciar")
}

app.post("/user-test/", function(req, res) {
  var bodyStr = JSON.stringify(req.body)
  console.log("body = " + bodyStr)
  console.log("url imagem = " + req.body.data[0].pic)


  users.getSession(req.body.data, function(userId){
    console.log("user form data base = "+ userId)
    try {
      res.json('{"ids" :' + JSON.stringify(userId) + '}');
    } catch (err) {
      console.log("Deu erro mas ta tudo certo.")
    }
  });        
});


app.post("/webhook/", function(req, res) {

  // console.log("body = " + JSON.stringify(req.body))

  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    console.log("event.sender.id = " + event.sender.id)

    var messageCount = 0;
    var userAnswerYes = "***";
    var opcoesEnviadas = "***";
    var session = undefined;

    getUserInfo(sender, function(pic){
      userPic = pic;
      users.addSession(sender, userPic);
    })

    if(sessionUtil.getSession(sender) == undefined){
        console.log("Novo usuario");
        sessionUtil.addSession(sender);
        sessionUtil.listSession();
    }else{
        console.log("Usuario antigo");
        sessionUtil.listSession();
        session = sessionUtil.getSession(sender);

        messageCount = session.messageCount;
        userAnswerYes = session.userAnswerYes;
        opcoesEnviadas = session.opcoesEnviadas;

        console.log("messageCount = " + messageCount);
        console.log("userAnswerYes = " + userAnswerYes);
        console.log("opcoesEnviadas = " + opcoesEnviadas);
    }

    // getUserInfo(sender);
    console.log(JSON.stringify(event))
      // console.log("mensagem = " + JSON.stringify(event.message))

    if (event.message && event.message.text) {
      text = event.message.text
      text = text.trim();
      console.log("usuario dizendo =  " + text)

      if (text.toLowerCase() == "iniciar") {
        console.log("Restando usuario ")
        iniciarBot();
        sessionUtil.resetSession(sender);
      }

      console.log("passou do iniciar")

      if (userAnswerYes != "***") {

        console.log("Entrou no != ***")
        console.log("userAnswerYes = " + userAnswerYes)

        if (userAnswerYes == "HOTEL_MES") {
          console.log("Mês escolhido : " + text)
          userAnswerYes = "EMAIL";
          opcoesEnviadas += text + ";";

          var message = messageUtil.get(2).message_text;
          messenger.sendTextMessage(sender, message, token);
          sessionUtil.updateSession(sender, messageCount, userAnswerYes, opcoesEnviadas, userPic);
          continue
        } else if (userAnswerYes == "EMAIL") {
          
          console.log("Email = " + text)
          var message = messageUtil.get(3).message_text;
          opcoesEnviadas += text + ";";
          opcoesEnviadas = opcoesEnviadas.replace("***","")

          var respostas = opcoesEnviadas.split(";");

          var viewHtml = "";

          getUserInfoComplete(sender, function(user){
                
                viewHtml += "<html> " + 
                             "  <meta charset= \"UTF8\" /> " + 
                             "  <body style=\"margin: 0 auto; font-family: Sans-serif; width: 50%; text-align: center;\"> " + 
                             "    <img style=\"width: 400px; margin-bottom: -10px border-radius:5px; box-shadow: 1px 1px 5px\"alt=\"Nannai Resort\" title=\"Nannai Resort\" src=\"http://www.topbrasiltur.com.br/nannaibeachresort/images/pacotes-tahiti-foto-7.jpg\"></img> " + 
                             "    <div style=\"border-radius: 5px;\"> " + 
                             "      <h1 style=\"font-size:25px;\">Nannai Resort & Spa</h1> " + 
                             "      <div style=\"font-size:20px; margin-bottom:10px\">" + user.first_name + " " + user.last_name + "</div> " + 
                             "      <div> " + 
                             "        <div style=\"font-size:18px;\">" + messageUtil.get(0).message_text + "</div> " + 
                             "        <div>" + respostas[0] + "</div> " + 
                             "      </div> " + 
                             "      <div> " + 
                             "        <div style=\"font-size:18px;\">" + messageUtil.get(1).message_text + "</div> " + 
                             "        <div>" + respostas[1] + "</div> " + 
                             "      </div> " + 
                             "      <div> " + 
                             "        <div style=\"font-size:18px;\"/>" + messageUtil.get(2).message_text + "</div> " + 
                             "        <div style=\"padding-bottom:18px;\">" + respostas[2] + "</div> " + 
                             "      </div> " + 
                             "      <!--</div> " + 
                             "    </div>--> " + 
                             "  </body> " + 
                             "</html> ";

              var options = {  //email options
                   from: "Hackathon Viagens Team Recife <fj.martins1101@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                   to: "<fabioxd20@gmail.com>, <kleberdarlanmonte@gmail.com>, <calixtounicap@gmail.com>, <rembertalcantara@gmail.com>", // receiver
                   subject: "Usuario  completou fluxo do bot messenger", // subject
                   html: viewHtml // body
                    };

              console.log("Corpo do email "+ viewHtml)
              email.send(options);

              messenger.sendTextMessage(sender, message, token);
              sessionUtil.resetSession(sender);
              iniciarBot();
          //continue
          })


          
        } 
      } else {
        console.log("Entrou != iniciar")
        var message = messageUtil.get(messageCount);

        var d = new Date();
        var n = d.getHours();
        var saudacao = "";

        if (n < 15) {
          saudacao = "Bom dia";
        } else if (n >= 15 && n < 21) {
          saudacao = "Boa tarde";
        } else {
          saudacao = "Boa noite"
        }
        var mensagem_to_send = message.message_text
        mensagem_to_send = mensagem_to_send.replace("[HORARIO]", saudacao);

        console.log("result.text != undefined");
        messageCount = 1;
        userAnswerYes = message.yesAnswer;
        userAnswerNo = message.noAnser;
        messageIdNo = message.nokId;
        messageIdYes = message.okId;

        // console.log("message = " + message);
        console.log("message text = " + message.message_text);

        var arrayButton = buildMenuArray(mensagem_to_send, "http://www.nannaispa.com.br/images/backgrounds/section1.jpg", "");
        console.log("SENDER ID = "+ sender);
        sessionUtil.updateSession(sender, messageCount, userAnswerYes, opcoesEnviadas, userPic);
        messenger.sendGenericMessage(sender, arrayButton);
      }
    }
    if (event.postback) {
      // text = JSON.stringify(event.postback)

      if (event.postback.payload == "HOTEL_SIM") {
        messageCount = 1;
        var message = messageUtil.get(1).message_text;
        console.log("hotel sim ")
        console.log("message = " + message)
        opcoesEnviadas += "SIM;"

        messenger.sendTextMessage(sender, message, token);
        userAnswerYes = "HOTEL_MES";
        sessionUtil.updateSession(sender, messageCount, userAnswerYes, opcoesEnviadas, userPic);
        continue
      } else if (event.postback.payload == "HOTEL_NAO") {

        var arrayElements = buildMenuCardapio();
        messenger.sendGenericMessage(sender, arrayElements);
        sessionUtil.updateSession(sender, messageCount, userAnswerYes, opcoesEnviadas, userPic);
        continue
        //var message = messageUtil.get(4).message_text;
        //messenger.sendTextMessage(sender, message, token);
        //sessionUtil.resetSession(sender);
        //iniciarBot();
      } else {
        messenger.sendTextMessage(sender, "Ops, ainda não implementamos essa funcionalidade.", token);
        console.log("POSTBACk nao identificado = " + event.postback.payload)
      }

    }
  }
  if (event.message && event.message.attachments) {

    if (event.message.attachments) {
      console.log("URL IMAGEM = " + event.message.attachments[0].payload.url)

      if (userAnswerYes == "LOCALIZACAO_PEDIDO") {
        if (event.message.attachments[0].type == "location") {
          var cordenadas = event.message.attachments[0].payload.coordinates;
          messenger.sendTextMessage(sender, "Pronto! Pedido confirmado, estamos enviando seu pedido para esse local.", token);
          iniciarBot();
          // sessionUtil.resetSession(sender);
        } else {
          messenger.sendTextMessage(sender, "Por favor, me envie sua localização", token);
        }
      }


    } else {
      console.log("event.attachments = " + event.attachments)
        // console.log("event.attachments = "+ event.message.attachments)
    }


  }
// } // else
  res.sendStatus(200)
});


function buildMenuArray(title, imgURL, subtitle){

  var arrayButton = [];

        arrayButton.push({
            "title":title,
            "image_url":imgURL,
            "subtitle":subtitle,
            "buttons":[
              {
                "type":"postback",
                "title":"Sim",
                "payload":"HOTEL_SIM"
              },
              {
                "type":"postback",
                "title":"Não",
                "payload":"HOTEL_NAO"
              } ]});
  return arrayButton;
}

function buildMenuCardapio(){
  var arrayElements = [];
  var arrayButtons  = [];

        arrayButtons.push({
            "type" : "postback",
            "title": "Escolher",
            "payload": "HOTEL_SIM"
        });
  var mensagem_ajuda = "Navegue nos opções, e faça sua escolha.";
   arrayElements.push({
          "title": "Viagem romântica",
          "subtitle": mensagem_ajuda,
          "image_url": "http://segredinhosdeviagem.com/wp-content/uploads/2014/05/ferias-romanticas.jpg",
          "buttons": arrayButtons
        });
        arrayElements.push({
          "title": "Viagem com esportes radicais",
          "subtitle": mensagem_ajuda,
          "image_url": "http://www.vooseviagens.com.br/wp-content/uploads/2016/03/Esportes-Radicais-na-Voos-e-Viagens.jpg",
          "buttons": arrayButtons
        });
        arrayElements.push({
          "title": "Viagem com amigos",
          "subtitle": mensagem_ajuda,
          "image_url": "http://projetosejafeliz.com/wp-content/uploads/2015/05/onde-estao-seus-amigos.jpg",
          "buttons": arrayButtons
        });
         arrayElements.push({
          "title": "Viagem de compras",
          "subtitle": mensagem_ajuda,
          "image_url": "http://www.myenglishtown.com.br/blog/wp-content/uploads/2014/09/na-hora-de-fazer-compras.jpg",
          "buttons": arrayButtons
        });
  return arrayElements;
}

var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD"

function getUserInfo(sender, callback) {
  request("https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic&access_token=" + token, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("First name = " + body) // Show the HTML for the Google homepage.
      //console.log("profile_pic = " + body.profile_pic)
      var jsonresp = JSON.parse(body)
      // console.log("First name 2 = " + jsonresp.profile_pic)
      callback(jsonresp.profile_pic)
    } else {
      console.log("Erro  = " + body)
      console.log("Error get user info");
    }
  })
}

function getUserInfoComplete(sender, callback) {
  request("https://graph.facebook.com/v2.7/" + sender + "?fields=first_name,last_name,gender,locale,profile_pic&access_token=" + token, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Completo First name = " + body) // Show the HTML for the Google homepage.
      //console.log("profile_pic = " + body.profile_pic)
      var jsonresp = JSON.parse(body)
      // console.log("First name 2 = " + jsonresp.profile_pic)
      callback(jsonresp)
    } else {
      console.log("Erro ao consultar completo = "+ body)
      console.log("Error get user info");
    }
  })
}

// Spin up the server
app.listen(app.get("port"), function() {
  console.log("running on port", app.get("port"))
});
