const Config = require("../config.json");
const Discord = require("discord.js")

module.exports = async(client, msg) => {
    

    if (msg.author.bot) return;

    if(msg.channel.type === "dm") return;

    if(!msg.content.startsWith(Config.configs.prefix)) return;

    

    const args = msg.content.slice(Config.configs.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    const cmd = client.commands.get(command)

    if(!cmd) return;

    cmd.run(client, msg, args);
    
    msg.delete(1000)
};

module.exports.event = "message"