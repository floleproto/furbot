const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const snekfetch = require('snekfetch'); // https://www.npmjs.com/package/snekfetch
const owo = require('@zuzak/owo') // https://www.npmjs.com/package/@zuzak/owo
const furaffinity = require('furaffinity')

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const prefix = config.configs.prefix

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "noise intensifies"
    }
  })
});

client.on('message', message => {
  if (message.content === prefix + 'furryirl') {
    message.author.lastMessage.delete()
    SearchFurryIRL(message)
  }

  if(message.content.startsWith(prefix + "owofy")) {
    var args = message.content.split(" ")
    var str = ""

    for(var test in args){
      if(test == 0) continue;
      str = str + " " + args[test]
    }
    message.author.lastMessage.delete()
    message.channel.send(owo(str))
  }

  if(message.content.startsWith(prefix + "fa")) {
    var args = message.content.split(" ")
    var str = ""

    for(var test in args){
      if(test == 0) continue;
      str = str + " " + args[test]
    }
    message.author.lastMessage.delete()
    SearchFA(message, str.trim())
  }

  if(message.content.startsWith(prefix + "help")){
    const embed = new Discord.RichEmbed()
      .setColor(message.member.colorRole.hexColor)
      .setTitle("**__Aide__**")
      .setDescription("Voici une aide bien précieuse jeune fur :3\n Préfix : `" + prefix + "`")
      .addField(prefix + "furryirl", "Permet de voir un meme venant du subredit furry_irl.")
      .addField(prefix + "owofy <votre texte>", "Permet de rendre votre texte plus cliché UwU.")
      .addField(prefix + "fa <termes de la recherche>", "Recherchez vos arts anthro favoris.")
      .addField(prefix + "e621 <termes de la recherche>", "Je n'ai pas besoin de l'expliquer je pense.\n__FONCTIONNE SEULEMENT DANS UN CHANNEL NSFW__")
      .addField(prefix + "info", "Permet d'avoir les infos du bot.")
      .addField(prefix + "git", "Permet de voir le code source du bot.")
      .setFooter("Plugin created by Flo - Fan")
    message.author.send(embed)
    message.author.lastMessage.delete()
  }

});

function SearchFA(message, search) {
  let {Search, Type} = require('furaffinity');
  Search(search, Type.Artwork).then(data =>{
    // let rnd = Math.floor(Math.random() * data.length)
    data[0].getSubmission().then(sub => {
      const embed = new Discord.RichEmbed()
      .setColor(message.member.colorRole.hexColor)
      .setTitle(sub.title)
      .setDescription("Fait par : " + sub.author.name)
      .setImage(sub.image.url)
      .setURL(sub.url)
      message.channel.send(embed)
    })
    .catch(err => {
      const embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setTitle("Erreur")
      .setDescription("Une erreur c'est produite")
      .addField("Détails", err)
      .addField("Veuillez réessailler avec d'autres mots", "Si l'erreur persiste, ouvrez une issue sur le gitlab FurBot (!gitlab)")
      message.channel.send(embed)
    })
  })
}

async function SearchFurryIRL(message){
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/furry_irl.json?sort=top&t=week')
      .query({
        limit: 800
      });
    const allowed = body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('Y\'a plus rien sorry ;w;.');
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const embed = new Discord.RichEmbed()
      .setTitle(allowed[randomnumber].data.title)
      .setDescription("Posté par: " + allowed[randomnumber].data.author)
      .setImage(allowed[randomnumber].data.url)
      .addField("Autres informations :", ":arrow_up: " + allowed[randomnumber].data.ups + " | :pencil: " + allowed[randomnumber].data.num_comments)
      .setFooter("Meme venant du subreddit furry_irl")
      .setURL(allowed[randomnumber].data.url)
      .setColor(message.member.colorRole.hexColor)
    message.channel.send(embed)
  } catch (err) {
    return console.log(err);
  }
} 

client.login(config.configs.token);