/*-----------------------------------------------------------------------------
This Bot demonstrates how to create a simple menu for a bot. We've also added a
reloadAction() to the menus dialog which lets you return to the menu from any 
child dialog by simply saying "menu" or "back". 
# RUN THE BOT:
    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "a4e7d3de-f410-47ba-aa29-706e63fa39d9",
    appPassword: "r9HjGnxe7nvY2G6WVWK9geT"
});

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Setup bot and root waterfall
var bot = new builder.UniversalBot(connector);

var model = 'https://api.projectoxford.ai/luis/v2.0/apps/c5459c20-6962-4768-ad07-892a270f52b1?subscription-key=fb670f8f02b941b2ae7a9d7777b49223';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

//bot.dialog('/api/messages', dialog);

//abrir_mei

server.post('/api/messages', connector.listen());

dialog.matches('abrir_mei', [
    function (session, args, next) {
        session.send("vc escolhei opcao sim para o mei.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

// dialog.onBegin(function(session,args){
//   builder.DialogAction.send("Desculpe não entendi, vc pode tentar falar com outras palavras.")
// });

dialog.onDefault(builder.DialogAction.send("Desculpe não entendi, vc pode tentar falar com outras palavras."));
