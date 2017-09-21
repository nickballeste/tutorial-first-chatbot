
var env = require('node-env-file');
env(__dirname + '/.env');


if (!process.env.PAGE_TOKEN) {
    console.log('Error: Especifique o PAGE_TOKEN no arquivo .env');
    usage_tip();
    process.exit(1);
}

if (!process.env.VERIFY_TOKEN) {
    console.log('Error: Especifique VERIFY_TOKEN no arquivo in environment.');
    usage_tip();
    process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

// Cria o controlador do Botkit que vai orquestrar todas as instâncias do Bot
var controller = Botkit.facebookbot({
    debug: true,
    verify_token: process.env.VERIFY_TOKEN,
    access_token: process.env.PAGE_TOKEN,
});

// Configura um Webserver Express que cuida dos endpoints dos webhooks e autorizações
var webserver = require(__dirname + '/components/express_webserver.js')(controller);
//Diz ao Messenger para começar a enviar eventos para esta aplicação
require(__dirname + '/components/subscribe_events.js')(controller);
// Configura o a API de Perfil do Bot do Messenger com informações como botão "Começar"
require(__dirname + '/components/thread_settings.js')(controller);


//Inicializa todos os arquivos da pasta skills, executando os métodos exportados de cada
//arquivo. Cada skill fica ouvindo por eventos enviados pelo usuário
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});
