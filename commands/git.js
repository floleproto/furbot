const search = require('../search.js')
const Discord = require("discord.js")
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {
        // Send the git URL
        let embed = new Discord.RichEmbed()
            .setColor("#fc6d26")
            .setAuthor(client.language.git.author.name, client.language.git.author.icon_url, client.language.git.author.url)
            .setURL("https://gitlab.com/flofan/furbot")
            .setDescription(client.language.git.description)
            .addField(client.language.git.package.title, client.language.git.package.text)
        msg.channel.send(embed)
        
}

module.exports.help = {
    name: "git"
}
