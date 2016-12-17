var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",  // sets automatically host, port and connection security settings
	auth: {
		user: "fj.martins1101@gmail.com",
		pass: "*HiF@1403m#kp18acw9"
	}
});

/* Example
var options = {  //email options
   from: "Hackathon Viagens Team Recife <teamrecife@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
   to: "<fabioxd20@gmail.com>, <kleberdarlanmonte@gmail.com>", // receiver
   subject: "Testando o Modulo de envio de Email do Sucesso", // subject
   text: "Quero saber quem é que vai ficar ricoooooooooooooo" // body
};
*/

module.exports = {
	send: function(options) {
		smtpTransport.sendMail(options, function(error, response){  //callback
			if(error){
				console.log(error);
			}else{
				console.log("Message sent: " + response.message);
			}   
			smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
		});
	}
};