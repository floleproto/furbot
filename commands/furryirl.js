const search = require('../search.js')
const Config = require("../config.json");

module.exports.run = async (client, msg, args) => {
    search.SearchFurryIRL(msg)
}

module.exports.help = {
    name: "furryirl"
}