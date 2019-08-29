const search = require('../search.js')
const Discord = require("discord.js")
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {
        var args = msg.content.split(" ")
        // Check if the channel is NSFW
        if (!msg.channel.nsfw) {
            // Send error
            var embed = new Discord.RichEmbed()
                .setColor("#ff0000")
                .setTitle(client.language.global.error)
                .setDescription(client.language.e621.error.nonsfw)
            msg.channel.send(embed)

        } else if (args.length < 2) {
            // Show info if no argument
            var embed = new Discord.RichEmbed()
                .setAuthor(client.language.e621.author.name, client.language.e621.author.icon_url, client.language.e621.author.url)
                .setColor("#0000ff")
                .addField(client.language.e621.info.usage.title, client.language.e621.info.usage.text.replace("%prefix%", Config.configs.prefix), true)
                // rating:s (safe; questionable; explicit)
                .addField(client.language.e621.info.hint.title, client.language.e621.info.hint.text)
                .addField(client.language.e621.info.example.title, client.language.e621.info.example.text.replace("%prefix%", Config.configs.prefix))
            msg.channel.send(embed)
        } else {
            var str = ""
            // Get argument after !e621
            for (var test in args) {
                if (test == 0) continue;
                str = str + args[test] + "+"
            }
            search.SearchE621(msg, str)
        }


}

module.exports.help = {
    name: "e621"
}