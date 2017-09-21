module.exports = function(controller) {

    // listen for someone saying 'tasks' to the bot
    // reply with a list of current tasks loaded from the storage system
    // based on this user's id
    controller.hears(['tarefas'], 'message_received', function(bot, message) {

        // load user from storage...
        controller.storage.users.get(message.user, function(err, user) {

            // user object can contain arbitary keys. we will store tasks in .tasks
            if (!user || !user.tasks || user.tasks.length == 0) {
                bot.reply(message, 'Não existem tarefas na sua lista. Digite `adicionar <nome_da_tarefa>` para criar uma nova tarefa.');
            } else {
                var text = 'Aqui estão suas tarefas:';
                bot.reply(message, text, function() {
                    bot.reply(message, generateTaskList(user), function() {
                        var text = 'Digite `concluir <número_da_tarefa>` para marcá-la como concluída.';
                        bot.reply(message, text);
                    });
                });
            }
        });

    });

    // listen for a user saying "add <something>", and then add it to the user's list
    // store the new list in the storage system
    controller.hears(['adicionar (.*)'],'message_received', function(bot, message) {

        var newtask = message.match[1];
        controller.storage.users.get(message.user, function(err, user) {

            if (!user) {
                user = {};
                user.id = message.user;
                user.tasks = [];
            }

            user.tasks.push(newtask);

            controller.storage.users.save(user, function(err,saved) {

                if (err) {
                    bot.reply(message, 'Ocorreu algum erro ao tentar adicionar sua tarefa: ' + err);
                } else {
                    bot.reply(message,'Tarefa adicionada.');
                }

            });
        });

    });

    // listen for a user saying "done <number>" and mark that item as done.
    controller.hears(['concluir (.*)'],'message_received', function(bot, message) {

        var number = message.match[1];

        if (isNaN(number)) {
            bot.reply(message, 'Por favor, especifique um número para a tarefa.');
        } else {

            // adjust for 0-based array index
            number = parseInt(number) - 1;

            controller.storage.users.get(message.user, function(err, user) {

                if (!user) {
                    user = {};
                    user.id = message.user;
                    user.tasks = [];
                }

                if (number < 0 || number >= user.tasks.length) {
                    bot.reply(message, 'O número digitado para a tarefa está fora do intervalo. Existem ' + user.tasks.length + ' tarefas na sua lista.');
                } else {

                    var item = user.tasks.splice(number,1);

                    // reply with a strikethrough message...
                    bot.reply(message, '~' + item + '~');

                    if (user.tasks.length > 0) {
                        bot.reply(message, 'Aqui estão as tarefas restantes:\n' + generateTaskList(user));
                    } else {
                        bot.reply(message, 'Sua lista de tarefas está vazia.');
                    }
                }
            });
        }

    });

    function generateTaskList(user) {

        var text = '';

        for (var t = 0; t < user.tasks.length; t++) {
            text = text + '> `' +  (t + 1) + '`) ' +  user.tasks[t] + '\n';
        }

        return text;

    }
}
