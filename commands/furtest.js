const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {
    // Check if somebody is Furry
    var args = msg.content.split(" ")
    if (args.length > 1) {
        // Get a random number between 1 & 100
        var i = Math.floor((Math.random() * (100 - 1) + 1))

        // Send embed

        var embed = new Discord.RichEmbed()
            .setTitle(client.language.furtest.title)
            .setDescription(client.language.furtest.description.replace("%player%", args[1]).replace("%percent%", i))
        // Change color
        if (i < 50) {
            embed.setColor("#ff0000")
        } else if (i >= 50 && i < 75) {
            embed.setColor("#ffff00")
        } else if (i >= 75) {
            embed.setColor("#00ff00")
        }
        
        msg.channel.send(embed)
    }
}

module.exports.help = {
    name: "furtest"
}