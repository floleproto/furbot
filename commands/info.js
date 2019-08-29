const search = require('../search.js')
const Discord = require("discord.js")
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {

    // Send info about the bot
    var embed = new Discord.RichEmbed()
        .setColor("#b0c400")
        .setTitle(client.language.info.title)
        .setDescription(client.language.info.description)
        .addField(client.language.info.version, version)
        .addField(client.language.info.ping, client.ping)
        .addField(client.language.info.creator.name, client.language.info.creator.text)
        .setFooter(client.language.info.footer.replace("%prefix%", Config.configs.prefix))
    msg.channel.send(embed)
}

module.exports.help = {
    name: "info"
}