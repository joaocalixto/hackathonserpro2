var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var messageUtil = require('./messageUtil')
var sessionUtil = require('./sessionUtil')

var app = express()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())


// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'token1234') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


    var messageCount = 0;
    var userAnswerYes = "***";
    var opcoesEnviadas = "***";
    var session = undefined;



function iniciarBot(){
    messageCount = 0;
    userAnswerYes = "***";
    opcoesEnviadas = "***";
    console.log("Entrou == iniciar")
}


app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        console.log("event.sender.id = "+ event.sender.id)


       // getUserInfo(sender);
        console.log(JSON.stringify(event))
       // console.log("mensagem = " + JSON.stringify(event.message))
     
    if (event.message && event.message.text) {
        text = event.message.text
        text = text.trim();
        console.log("usuario dizendo =  "+ text)

        if(text.toLowerCase() == "iniciar"){
            sessionUtil.resetSession(sender);
        }

        console.log("passou do iniciar")

        if(opcoesEnviadas != "***"){
            sendTextMessage(sender, "Eu sei que voce gosta de conversar, mas voce poderia escolher alguma das opções acima?", token);
            continue 
        }


        if(userAnswerYes != "***"){

            console.log("Entrou no != ***")
            console.log("userAnswerYes = "+userAnswerYes)

            if(userAnswerYes == "FAZER_PEDIDO"){


                var arrayButton = [];
                    
                    arrayButton.push({
                                    "type": "postback",
                                    "title": "Confirmar Pedido",
                                    "payload": "CONFIRMAR_PEDIDO"
                                },{
                                    "type": "postback",
                                    "title": "Refazer Pedido",
                                    "payload": "REFAZER_PEDIDO"
                                }
                                );

                sendTemplateButton(sender, "Muito bom, são dois caldinhos de peixe e uma macaxeira frita ?", arrayButton);
                continue
            }else if(userAnswerYes == "LOCALIZACAO_PEDIDO"){
                sendTextMessage(sender, "Pronto! Pedido confirmado, estamos enviando seu pedido para esse local.", token);
                iniciarBot();
                continue
            }
        }else{
                console.log("Entrou != iniciar")
                var message = messageUtil.get(messageCount);

                var d = new Date();
                var n = d.getHours();
                var saudacao = "";

                if(n < 15){
                    saudacao = "Bom dia";
                }else if(n >= 15 && n < 21){
                    saudacao = "Boa tarde";
                }else{
                    saudacao = "Boa noite"
                }
                var mensagem_to_send = message.message_text
                mensagem_to_send = mensagem_to_send.replace("[HORARIO]", saudacao);

                console.log("message = "+ message);
                console.log("message text = "+ message.message_text);
                  
                var arrayButton = [];
                    
                    arrayButton.push({
                                    "type": "postback",
                                    "title": "Ver Cardápio",
                                    "payload": "MOSTRAR_CARDAPIO"
                                },{
                                    "type": "postback",
                                    "title": "Falar com um atendente.",
                                    "payload": "FALAR_ATENDENTE"
                                }
                                );

                sendTemplateButton(sender, "Olá! Seja muito ao nosso restaurante! Qual vai ser a pedida de hoje ?", arrayButton);
        }
    }if (event.postback) {
            // text = JSON.stringify(event.postback)

            if(event.postback.payload == "MOSTRAR_CARDAPIO"){
                sendTextMessage(sender, "Otimo, agora digite a quantidade e o codigo do produto. Assim : 2x 101, 1x 105", token);
                sendImage(sender, "http://coqueiralpark.com/wp-content/uploads/2015/09/Card%C3%A1pio-Lanchonete.jpg");
                userAnswerYes = "FAZER_PEDIDO";
                continue
            }else if(event.postback.payload == "CONFIRMAR_PEDIDO"){
                sendTextMessage(sender, "Otimo, me diga agora onde devemos entregar seu pedido. Voce pode envia sua localizacao ou digitar seu endereço.", token);
                userAnswerYes = "LOCALIZACAO_PEDIDO";
                continue
            }else{
                console.log("POSTBACk nao identificado = "+ event.postback.payload)
            }
           
        }
    }
    if(event.message && event.message.attachments){

        if(event.message.attachments){
            console.log("URL IMAGEM = "+event.message.attachments[0].payload.url)

            if(userAnswerYes == "LOCALIZACAO_PEDIDO"){
                if(event.message.attachments[0].type == "location"){
                    var cordenadas = event.message.attachments[0].payload.coordinates;
                    sendTextMessage(sender, "Pronto! Pedido confirmado, estamos enviando seu pedido para esse local.", token);
                    iniciarBot();
                    // sessionUtil.resetSession(sender);
                }else{
                    sendTextMessage(sender, "Por favor, me envie sua localização", token);
                }
            }
            

        }else{
            console.log("event.attachments = "+ event.attachments)
            // console.log("event.attachments = "+ event.message.attachments)
        }
        

    }
    res.sendStatus(200)
})

var token = "EAAYVKS3zpHcBAIqdI7O6rZAqKl7CcZBBlrxNZBtfK3NPIMqWpZA4oG7JWrEm1jPEexvNcZBFqXR2vy8KtvzKdmX47aY7Vo7J8NqS3ka9h0Sl0aSNHbKHAjppcv5ggY5WZC3FZBiTNFsAtPDkf06GuE7GW8EGyF29UPORAFpBZBSoOgZDZD"

function validarCPF(cpf) {  
    cpf = cpf.replace(/[^\d]+/g,'');    
    if(cpf == '') return false; 
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;       
    // Valida 1o digito 
    add = 0;    
    for (i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    // Valida 2o digito 
    add = 0;    
    for (i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10)))
        return false;       
    return true;   
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendImage(sender, url) {
    messageData = {
        "attachment": {
            "type": "image",
            "payload": { url }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendButtonsYesNo(sender, message, payloadTrue, payloadFalse) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": message,
                    "buttons": [{
                        "type": "postback",
                        "title": "Sim",
                        "payload": payloadTrue
                    }, {
                        "type": "postback",
                        "title": "Não",
                        "payload": payloadFalse,
                    }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendTemplateButton(sender, message, arrayButton) {

    // opcoesEnviadas = "OPCOES_ENVIADAS";
    // {"tittle": teste, "payload":testepay}

    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": message,
                    "buttons": arrayButton
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function getUserInfo(sender) {
    request('https://graph.facebook.com/v2.6/'+sender+'?fields=first_name,last_name,profile_pic&access_token='+token, function (error, response, body) {
          if (!error && response.statusCode == 200) {
                console.log("First name = " + body) // Show the HTML for the Google homepage.
                console.log("First name 2 = " + response.first_name)
            }else{
                console.log("Error get user info");
            }
          })
}



function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

