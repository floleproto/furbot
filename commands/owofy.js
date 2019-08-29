const search = require('../search.js')
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {

    // Get strings after !owofy
    
    
    msg.channel.send(owo(args.join(" ")))
}

module.exports.help = {
    name: "owofy"
}