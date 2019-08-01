const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const snekfetch = require('snekfetch'); // https://www.npmjs.com/package/snekfetch
const owo = require('@zuzak/owo') // https://www.npmjs.com/package/@zuzak/owo
const furaffinity = require('furaffinity') // https://www.npmjs.com/package/furaffinity

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const prefix = config.configs.prefix

const version = "1.0"

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "Beep Boop."
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
    if(!(args.length > 1)) {
      var embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setTitle(":warning: ERREUR :warning:")
      .setDescription("Il manque le terme de votre recherche.")
      .addField("Example", "`" + prefix + "fa protogen`\nPermet de rechercher une image relative aux êtres sublimes que sont les protogens sur FurAffinity")
      message.channel.send(embed)
       return
    }
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
      .addField(prefix + "fa <termes de la recherche>", "Recherchez vos arts anthro' favoris.")
      .addField(prefix + "e621 <termes de la recherche>", "Je n'ai pas besoin de l'expliquer je pense.\n__FONCTIONNE SEULEMENT DANS UN CHANNEL NSFW__")
      .addField(prefix + "info", "Permet d'avoir les infos du bot.")
      .addField(prefix + "git", "Permet de voir le code source du bot.")
      .setFooter("Plugin created by Flo - Fan")
    message.author.send(embed)
    message.author.lastMessage.delete()
  }

  if(message.content == prefix + "git")
  {
    let embed = new Discord.RichEmbed()
    .setColor("#fc6d26")
    .setTitle("GitLab")
    .setURL("https://gitlab.com/flofan/furbot")
    .setDescription("Voici l'URL du code source :  https://gitlab.com/flofan/furbot")
    .addField("Packets utilisées :", "- discord.js : https://www.npmjs.com/package/discord.js \n- snekfetch : https://www.npmjs.com/package/snekfetch \n- @zuzak/owo : https://www.npmjs.com/package/@zuzak/owo \n- fur-node : https://www.npmjs.com/package/furaffinity")
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if(message.content == prefix + "info") {
    let embed = new Discord.RichEmbed()
    .setColor(message.member.colorRole.hexColor)
    .setTitle("**__Informations__**")
    .setDescription("Informations relatives aux bots")
    .addField("Version", version)
    .addField("Ping", client.ping)
    .addField("Bot crée par", "Flo - Fan")
    .setFooter('Pour voir le code source : '+ prefix +'git')
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if(message.content == prefix + "e621") {
    if(!message.channel.nsfw) {
      var embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setTitle(":warning: ERREUR :warning:")
      .setDescription("Merci d'utiliser cette commande dans un channel NSFW.\nIl ne faudrait pas choquer les jeunes.")
      message.author.lastMessage.delete()
      message.channel.send(embed)
      return
    }
  }

  if(message.content.startsWith(prefix + "furtest")){
    var args = message.content.split(" ")
    if(args.length > 1){
      var i = Math.floor((Math.random() * (100 - 1) + 1))

      var embed = new Discord.RichEmbed()
      .setTitle("Furtest")
      .setDescription(args[1] + " est furry à " + i + "%.")
      if(i < 50) {
        embed.setColor("#ff0000")
      }else if(i >= 50 && i < 75) {
        embed.setColor("#ffff00")
      }else if(i >= 75) {
        embed.setColor("#00ff00")
      }
      message.author.lastMessage.delete()
      message.channel.send(embed)
    }
  }

});

function SearchFA(message, search) {
  let {Search, Type, Species, Gender} = require('furaffinity');
  Search(search, Type.Artwork).then(data =>{
    // let rnd = Math.floor(Math.random() * data.length)
    try{ 
      data[0].getSubmission().then(sub => {
        const embed = new Discord.RichEmbed()
        .setColor(message.member.colorRole.hexColor)
        .setTitle(sub.title)
        .setDescription("Fait par : " + sub.author.name)
        .setImage(sub.image.url)
        .addField(" Stats ", ":star: " + sub.stats.favorites + " :pencil: " + sub.stats.comments + " :eye: " + sub.stats.views)
        .addField(" Informations spécifiques ", "Espèces : " + Species[sub.content.species] + "\nGenres : " + Gender[sub.content.gender])
        .setURL(sub.url)
        .setFooter(sub.keywords)
        message.channel.send(embed)
      })
      .catch(err => {
        const embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(":warning: ERREUR :warning:")
        .setDescription("Une erreur c'est produite")
        .addField("Détails", err)
        .addField("Veuillez réessailler avec d'autres mots", "Si l'erreur persiste, ouvrez une issue sur le git FurBot ("+ prefix +"git)")
        message.channel.send(embed)
      })
    }catch(err){
      const embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(":warning: ERREUR 404 :warning:")
        .setDescription("Aucune image de trouvée")
        message.channel.send(embed)
        console.log("Possibility of 404 : " + err)
    }
    
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