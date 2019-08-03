const version = "1.0"

//Load modules

const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const owo = require('@zuzak/owo') // https://www.npmjs.com/package/@zuzak/owo
const search = require('./search.js')

// Load configuration file

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Load language

try {
  var language = JSON.parse(fs.readFileSync('language/' + config.configs.language + '.json', 'utf8'))

} catch (err) {
  console.log(err)
  client.destroy()
  process.exit()
}

// Add const prefix

const prefix = config.configs.prefix

var ON_DEATH = require('death');

// On proccess kill, destroy client

ON_DEATH(function (signal, err) {
  client.destroy()
  process.exit()
})

// When the bot is Loaded

client.on('ready', () => {
  // Print in the console the bot is loaded
  console.log(`Bot lancé : ${client.user.tag}.`);
  // Add presence for 10 seconds
  client.user.setPresence({
    game:{
      name:"Bot started."
    }
  })

  // Add interval to change the rich presence
  setInterval(ChangeRP, 10000)
});

client.on('message', message => {

    // Commands

  // FurryIRL
  if (message.content === prefix + 'furryirl') {
    message.author.lastMessage.delete()
    search.SearchFurryIRL(message)
  }

  // OwOFy
  if (message.content.startsWith(prefix + "owofy")) {
    var args = message.content.split(" ")
    var str = ""
    // Get strings after !owofy
    for (var test in args) {
      if (test == 0) continue;
      str = str + " " + args[test]
    }
    message.author.lastMessage.delete()
    message.channel.send(owo(str))
  }

  if (message.content.startsWith(prefix + "fa")) {
    var args = message.content.split(" ")
    // Check if there is an argument
    if (!(args.length > 1)) {
      // Print error in the channem
      var embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(language.global.error)
        .setDescription(language.furaffinity.info.noargument)
        .addField(language.furaffinity.info.example.title, language.furaffinity.info.example.text.replace("%prefix%", prefix))
      message.author.lastMessage.delete()
      message.channel.send(embed)
      return
    }
    var str = ""
    // Get strings after !fa

    for (var test in args) {
      if (test == 0) continue;
      str = str + " " + args[test]
    }

    message.author.lastMessage.delete()
    search.SearchFA(message, str.trim())
  }

  if (message.content.startsWith(prefix + "help")) {
    // Help commands
    const embed = new Discord.RichEmbed()
      .setColor("#0e2e33")
      .setTitle(language.help.title)
      .setDescription(language.help.description.replace("%prefix%", prefix))
    // Print all commands registred in the language file
    for (var com in language.help.commands) {
      embed.addField(prefix + language.help.commands[com].usage, language.help.commands[com].description)
    }
    embed.setFooter(language.help.footer)
    message.author.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content == prefix + "git") {
    // Send the git URL
    let embed = new Discord.RichEmbed()
      .setColor("#fc6d26")
      .setAuthor(language.git.author.name, language.git.author.icon_url, language.git.author.url)
      .setURL("https://gitlab.com/flofan/furbot")
      .setDescription(language.git.description)
      .addField(language.git.package.title, language.git.package.text)
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content == prefix + "info") {
    // Send info about the bot
    let embed = new Discord.RichEmbed()
      .setColor("#b0c400")
      .setTitle(language.info.title)
      .setDescription(language.info.description)
      .addField(language.info.version, version)
      .addField(language.info.ping, client.ping)
      .addField(language.info.creator.name, language.info.creator.text)
      .setFooter(language.info.footer.replace("%prefix%", prefix))
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content.startsWith(prefix + "e621")) {
    var args = message.content.split(" ")
    // Check if the channel is NSFW
    if (!message.channel.nsfw) {
      // Send error
      var embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(language.global.error)
        .setDescription(language.e621.error.nonsfw)
      message.author.lastMessage.delete()
      message.channel.send(embed)

    } else if (args.length < 2) {
      // Show info if no argument
      var embed = new Discord.RichEmbed()
        .setAuthor(language.e621.author.name, language.e621.author.icon_url, language.e621.author.url)
        .setColor("#0000ff")
        .addField(language.e621.info.usage.title, language.e621.info.usage.text.replace("%prefix%", prefix), true)
        // rating:s (safe; questionable; explicit)
        .addField(language.e621.info.hint.title, language.e621.info.hint.text)
        .addField(language.e621.info.example.title, language.e621.info.example.text.replace("%prefix%", prefix))
      message.author.lastMessage.delete()
      message.channel.send(embed)
    } else {
      var str = ""
      // Get argument after !e621
      for (var test in args) {
        if (test == 0) continue;
        str = str + args[test] + "+"
      }
      message.author.lastMessage.delete()
      search.SearchE621(message, str)
    }
  }

  if (message.content.startsWith(prefix + "furtest")) {
    // Check if somebody is Furry
    var args = message.content.split(" ")
    if (args.length > 1) {
      // Get a random number between 1 & 100
      var i = Math.floor((Math.random() * (100 - 1) + 1))

      // Send embed

      var embed = new Discord.RichEmbed()
        .setTitle(language.furtest.title)
        .setDescription(language.furtest.description.replace("%player%", args[1]).replace("%percent%", i))
      // Change color
      if (i < 50) {
        embed.setColor("#ff0000")
      } else if (i >= 50 && i < 75) {
        embed.setColor("#ffff00")
      } else if (i >= 75) {
        embed.setColor("#00ff00")
      }
      message.author.lastMessage.delete()
      message.channel.send(embed)
    }
  }

});

function ChangeRP() {

  // Get all RichPresence in the file richpresence.json

  var rpcjson = JSON.parse(fs.readFileSync("richpresence.json", "utf8"))

  // Get a random number between the number of RPC and 0

  var rdn = Math.floor((Math.random() * (rpcjson.rpc.length - 1) + 0))
  // Set RPC
  client.user.setPresence({
    game: {
      name: rpcjson.rpc[rdn].text,
      type: rpcjson.rpc[rdn].type
    }
  })
}

// Login the bot with the token registered in the config file

client.login(config.configs.token);