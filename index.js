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

bot.dialog('/', dialog);

//abrir_mei

server.post('/api/messages', connector.listen());

dialog.matches('abrir_mei', [
    function (session, args, next) {
        session.send("Para virar MEI, basta fazer um cadastro bem fácil no site portaldoempreendedor.com.br. Em poucos minutos, "+
          "você consegue o seu Cadastro Nacional de Pessoas Jurídicas (CNPJ) e "+
          "fica mais simples abrir uma conta no banco para sua empresa, emitir notas fiscais e buscar empréstimos.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('o_que_e_mei', [
    function (session, args, next) {
        session.send("Microempreendedor Individual (MEI) é a pessoa que trabalha por conta própria e que se legaliza como pequeno empresário."+
            "Para ser um microempreendedor individual, é necessário faturar no máximo até R$ 60.000,00 por ano e não ter  participação em outra"+
            " empresa como sócio ou titular.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('saudacoes', [
    function (session, args, next) {
        session.send(
          "Oi eu sou o InforMEI, "+
          "seu assistente pessoal, estou aqui pra lhe ajudar a abrir ou cuidar do seu negócio."+
          " Digite 'ajuda' para eu te mostrar as áreas que posso te ajudar."
        );
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('nao_possui_mei', [
    function (session, args, next) {
        session.send("Antes de se formalizar dá uma olhadinha nos seguintes pontos: ");
        session.send("1 - Verificar se recebe algum benefício previdenciário (Exemplo: Aposentadoria por invalidez, Auxílio Doença, Seguro Desemprego, etc).");
        session.send("2 - Procurar a prefeitura para verificar se a atividade pode ser exercida no local desejado. ");
        session.send("3 - Verificar se as atividades escolhidas podem ser registradas como MEI.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('precisa_abrir_mei', [
    function (session, args, next) {
      session.send("Para se formalizar, se faz necessário informar o número do CPF e data de nascimento do titular, "+
        "o número do título de eleitor ou o número do último recibo de entrega da "+
        "Declaração Anual de Imposto de Renda Pessoa Física – DIRPF, caso esteja obrigado a entregar a DIRPF.");

    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('baixa_mei', [
    function (session, args, next) {
        session.send("O primeiro passo para dar baixa no MEI é solicitar o código de acesso no Portal Simples Nacional: "+
          "http://www8.receita.fazenda.gov.br/simplesnacional/controleacesso/GeraCodigo.aspx Para gerar esse código, "+
          "é necessário informar CNPJ, CPF, Título de Eleitor ou recibo de Declaração de Imposto de Renda de Pessoa Física e a data de nascimento. Mais informações "+
          "https://www.sebrae.com.br/sites/PortalSebrae/");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('abrir_outro_mei', [
    function (session, args, next) {
        session.send("Somente um, mas se você trabalha com outras coisas, "+
          "Você pode adicionar no seu cadastro, outras atividades extras.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('beneficios_abrir_mei', [
    function (session, args, next) {
        session.send("Pensão por morte: a partir do primeiro pagamento em dia; Auxílio reclusão: a partir do primeiro pagamento em dia; "+
          "Observação: se a contribuição do Microempreendedor Individual se der com base em um salário mínimo, "+
          "qualquer benefício que ele vier a ter direito também se dará com base em um salário mínimo.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('possui_mei', [
    function (session, args, next) {
        session.send("vc escolhei opcao sim para o mei.");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('boleto_mei', [
    function (session, args, next) {
        session.send("A emissão da guia de recolhimento mensal é feita a partir do aplicativo PGMEI, no Portal do Simples Nacional. "+
          "Clique aqui para acessar http://www.portaldoempreendedor.gov.br/mei-microempreendedor-individual/emissao-de-carne-de-pagamento-das");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('apresentacao', [
    function (session, args, next) {
        session.send(
          "Oi eu sou o InforMEI, "+
          "seu assistente pessoal, estou aqui pra lhe ajudar a abrir ou cuidar do seu negócio."+
          " Digite 'ajuda' para eu te mostrar as áreas que posso te ajudar."
        );
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.matches('ajuda', [
    function (session, args, next) {
        session.send("Posso te ajudar nas seguintes áreas: ");
        session.send("Como abrir um MEI");
        session.send("O que precisa para abrir um MEI");
        session.send("Benefícios");
        session.send("Como dar baixa no seu MEI");
        session.send("Posso abrir outro MEI");
        session.send("Boletos");
        session.send("Funcionários");
        session.send("Direitos");
        session.send("Atividades permitidas");
    },
    function (session, results) {
        console.log("resposta SIM")
    }
]);

dialog.onDefault(builder.DialogAction.send("Desculpe, não entendi. Você pode tentar falar com outras palavras."));
