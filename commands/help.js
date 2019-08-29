const search = require('../search.js')
const Config = require("../config.json");
const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {

    // Help commands
    const embed = new Discord.RichEmbed()
        .setColor("#0e2e33")
        .setTitle(client.language.help.title)
        .setDescription(client.language.help.description.replace("%prefix%", Config.configs.prefix))
    // Print all commands registred in the client.language file
    for (var com in client.language.help.commands) {
        embed.addField(Config.configs.prefix + client.language.help.commands[com].usage, client.language.help.commands[com].description)
    }
    embed.setFooter(client.language.help.footer)
    msg.author.send(embed)
}

module.exports.help = {
    name: "help"
}