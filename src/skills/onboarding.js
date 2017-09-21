module.exports = function(controller) {

    controller.hears(['GET_STARTED_PAYLOAD'], 'facebook_postback', function(bot, message) {
        bot.reply(message, 'Olá, eu sou seu primeiro bot! Bem-vindo! Você pode me dizer "oi" ou "tarefas", pois estas são minhas únicas funções no momento! ;) ');
    });

}
