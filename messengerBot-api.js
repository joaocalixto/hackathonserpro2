var request = require("request")
var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";

module.exports = {
	sendImage: function(sender, url) {

		var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";

		if(token == ""){
			return new Error("Token vazio")
		}else{
			console.log("TOKEN = "+ token);
		}

		messageData = {
			"attachment": {
				"type": "image",
				"payload": { url }
			}
		}
		request({
			url: "https://graph.facebook.com/v2.6/me/messages",
			qs: {access_token:token},
			method: "POST",
			json: {
				recipient: {id:sender},
				message: messageData,
			}
		}, function(error, response, body) {
			if (error) {
				console.log("Error sending messages: ", error)
			} else if (response.body.error) {
				console.log("Error: ", response.body.error)
			}
		})
	},
	init: function(tokenRequest){
		token = tokenRequest;

	},
    setWelcomeMessage: function(tokenRequest){
        var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";

        arrayButtons = [{
            "type": "postback",
            "title": "Mostrar Cardápio",
            "payload": "MOSTRAR_CARDAPIO"
        }]

        arrayElements = [{
            "title": "Bem vindo ao nosso restaurante!",
            "item_url": "https://www.restaurante.com",
            "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/03/98/c3/c5/rancho-mineiro-restaurante.jpg",
            "subtitle": "A melhor comida da sua cidade!",
            "buttons": arrayButtons
        }]

        arrayMessages = [{
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": arrayElements
                    }
                }
            }
            
        }]
        request({
            url: "https://graph.facebook.com/v2.6/941283392636534/thread_settings",
            qs: {access_token:token},
            method: "POST",
            json: {
                "setting_type": "call_to_actions",
                "thread_state": "new_thread",
                "call_to_actions": arrayMessages
            }
        }, function(error, response, body) {
            if (error) {
                console.log("Error sending messages: ", error)
            } else if (response.body.error) {
                console.log("Error: ", response.body.error)
            }else{
                console.log("Body: ", response.body) 
            }
        })

    },
    sendTextMessage: function(sender, text){
      var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";
      messageData = {
         text:text
     }
     request({
         url: "https://graph.facebook.com/v2.6/me/messages",
         qs: {access_token:token},
         method: "POST",
         json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
                if (error) {
                    console.log("Error sending messages: ", error)
                } else if (response.body.error) {
                    console.log("Error: ", response.body.error)
                }
    })

 },
sendReceiptMessage: function(sender, arrayElements){
      var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";

      endereco = {
        "street_1":"Rua ABCD",
        "street_2": "",
        "city": "Olinda",
        "postal_code": "33323444",
        "state": "PE",
        "country": "BR"
      };

      resumo = {
        "subtotal": 22.50,
        "shipping_cost": 4.00,
        "total_cost": 16.50
      };

      messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "receipt",
                "recipient_name": "Joao Calixto",
                "order_number": "12345678903333",
                "currency": "BRL",
                "payment_method": "Dinheiro",
                "elements": arrayElements,
                "address": endereco,
                "summary": resumo
            }
        }
     }
     request({
         url: "https://graph.facebook.com/v2.6/me/messages",
         qs: {access_token:token},
         method: "POST",
         json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
                if (error) {
                    console.log("Error sending messages: ", error)
                } else if (response.body.error) {
                    console.log("Error: ", response.body.error)
                }
    })

 },
 sendTemplateButton: function(sender, message, arrayButton){
		  // opcoesEnviadas = "OPCOES_ENVIADAS";
    // {"tittle": teste, "payload":testepay}

    var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";
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
    	url: "https://graph.facebook.com/v2.6/me/messages",
    	qs: {access_token:token},
    	method: "POST",
    	json: {
    		recipient: {id:sender},
    		message: messageData,
    	}
    }, function(error, response, body) {
    	if (error) {
    		console.log("Error sending messages: ", error)
    	} else if (response.body.error) {
    		console.log("Error: ", response.body.error)
    	}
    })
},
sendButtonsYesNo: function(sender, message, payloadTrue, payloadFalse){

	var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD";

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
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token:token},
        method: "POST",
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending messages: ", error)
        } else if (response.body.error) {
            console.log("Error: ", response.body.error)
        }
    })
},
sendGenericMessage: function(sender, arrayElements){

	var token = "EAAHej7ghJPYBAIiGyjm6M7RfhtjnGL7dK8bpjHHHzut5NtWuJkC4y6eOFWTx3lbtUHGrXYfYFYhioBCU9znXhxWdZA1rdFwNYWfZCIaEpZBrqqkMBFaOSZCc3jIKad7LJMy1rf5qZC5sbHBzGty5HEcQxytkZCgCIKZBJ7zPtXKagZDZD"
	messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": arrayElements
            }
        }
    }
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token:token},
        method: "POST",
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending messages: ", error)
        } else if (response.body.error) {
            console.log("Error: ", response.body.error)
        }
    })
},
sendQuickReply: function(sender, message, arrayReplies){

    var token = "EAAFZBLHIfeM0BAG2z6YKpUhKCoByf8cC57HFUuaShhCJN11tLyz7gZCnOlUDnB1JKZCvRUHQJE2xSBfZCfbZBTNHxTN7UpCHrhSzMxR0dHGBWOPNkmsgYJl9zo5b37S52PwUyaTi16zHbFhZCuEDLqdZCswihBeLic0H6JiHVXYuQZDZD"

    console.log("send quick_replies "+ JSON.stringify(arrayReplies));
    messageData = {
        "text":"Pick a color:",
        "quick_replies": arrayReplies
    }
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token:token},
        method: "POST",
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending messages: ", error)
        } else if (response.body.error) {
            console.log("Error: ", response.body.error)
        }
    })
}
};