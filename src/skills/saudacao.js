module.exports = function(controller) {

    controller.hears(['oi', 'olá'], 'message_received', function(bot, message) {
        bot.reply(message, 'Olá, eu sou seu primeiro bot! Como posso ajudar?');
    });

}
