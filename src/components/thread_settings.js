var debug = require('debug')('botkit:thread_settings');

module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting('Olá, eu sou o seu primeiro Chatbot!');
    controller.api.thread_settings.get_started('GET_STARTED_PAYLOAD');
}
