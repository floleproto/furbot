const version = "1.0"

// Load modules

const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const owo = require('owofy')
const search = require('./search.js')

// Register command's collection

client.commands = new Discord.Collection();

// Load configuration file

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Load client.language

try {
  client.language = JSON.parse(fs.readFileSync('language/' + config.configs.language + '.json', 'utf8'))

} catch (err) {
  console.log(err)
  client.destroy()
  process.exit()
}

// Add const prefix

var ON_DEATH = require('death');

// On proccess kill, destroy client

ON_DEATH(function (signal, err) {
  client.destroy()
  process.exit()
})

// When the bot is Loaded

fs.readdir("./commands/", (error, f) => {
  if(error) console.log("Erreur: " + error);

console.log("");
console.log("--- Commandes ---");
  let commands = f.filter(f => f.split(".").pop() === "js");
  if(commands.length <= 0) return console.log("Erreur: Aucune commande trouvée");

  commands.forEach((f) => {
      let command = require(`./commands/${f}`);
      console.log(`Commande ${f} chargée`);

      client.commands.set(command.help.name, command);
  });
});

fs.readdir("./events/", (error, f) => {
  if(error) console.log("Erreur: " + error);
  
console.log("");
console.log("--- Events ---");

  f.forEach((f) => {
      const events = require(`./events/${f}`);
      console.log(`${f} se charge. (${events.event})`)
      client.on(events.event, events.bind(null, client));
  });
});


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