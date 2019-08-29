const search = require('../search.js')
const Discord = require("discord.js")
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {

    if (!(args.length > 0)) {
        // Print error in the channel
        var embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTitle(client.language.global.error)
            .setDescription(client.language.furaffinity.info.noargument)
            .addField(client.language.furaffinity.info.example.title, client.language.furaffinity.info.example.text.replace("%prefix%", Config.configs.prefix))
        msg.channel.send(embed)
        return
    }

    search.SearchFA(msg, args.join(" "))

}

module.exports.help = {
    name: "fa"
}