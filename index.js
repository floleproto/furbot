const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const snekfetch = require('snekfetch'); // https://www.npmjs.com/package/snekfetch
const owo = require('@zuzak/owo') // https://www.npmjs.com/package/@zuzak/owo

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const prefix = config.configs.prefix

const version = "1.0"

var ON_DEATH = require('death'); //this is intentionally ugly

ON_DEATH(function (signal, err) {
  client.destroy()
  process.exit()
})

client.on('ready', () => {
  console.log(`Bot lancé : ${client.user.tag}.`);
  setInterval(ChangeRP, 10000)
});

client.on('message', message => {
  if (message.content === prefix + 'furryirl') {
    message.author.lastMessage.delete()
    SearchFurryIRL(message)
  }

  if (message.content.startsWith(prefix + "owofy")) {
    var args = message.content.split(" ")
    var str = ""

    for (var test in args) {
      if (test == 0) continue;
      str = str + " " + args[test]
    }
    message.author.lastMessage.delete()
    message.channel.send(owo(str))
  }

  if (message.content.startsWith(prefix + "fa")) {
    var args = message.content.split(" ")
    if (!(args.length > 1)) {
      var embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(":warning: ERREUR :warning:")
        .setDescription("Il manque le terme de votre recherche.")
        .addField("Example", "`" + prefix + "fa protogen`\nPermet de rechercher une image relative aux êtres sublimes que sont les protogens sur FurAffinity")
      message.channel.send(embed)
      return
    }
    var str = ""

    for (var test in args) {
      if (test == 0) continue;
      str = str + " " + args[test]
    }

    message.author.lastMessage.delete()
    SearchFA(message, str.trim())
  }

  if (message.content.startsWith(prefix + "help")) {
    const embed = new Discord.RichEmbed()
      .setColor(message.member.colorRole.hexColor)
      .setTitle("**__Aide__**")
      .setDescription("Voici une aide bien précieuse jeune fur :3\n Préfix : `" + prefix + "`")
      .addField(prefix + "furryirl", "Permet de voir un meme venant du subredit furry_irl.", true)
      .addField(prefix + "owofy <votre texte>", "Permet de rendre votre texte plus cliché UwU.", true)
      .addField(prefix + "fa <termes de la recherche>", "Recherchez vos arts anthro' favoris.", true)
      .addField(prefix + "e621 <termes de la recherche>", "Je n'ai pas besoin de l'expliquer je pense.\n__FONCTIONNE SEULEMENT DANS UN CHANNEL NSFW__", true)
      .addField(prefix + "info", "Permet d'avoir les infos du bot.", true)
      .addField(prefix + "git", "Permet de voir le code source du bot.", true)
      .addField(prefix + "furtest <nom>", "Permet de savoir si une personne est Furry", true)
      .setFooter("Plugin created by Flo - Fan")
    message.author.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content == prefix + "git") {
    let embed = new Discord.RichEmbed()
      .setColor("#fc6d26")
      .setAuthor("GitLab", "https://humancoders-formations.s3.amazonaws.com/uploads/course/logo/155/thumb_bigger_formation-gitlab.png", "https://about.gitlab.com")
      .setURL("https://gitlab.com/flofan/furbot")
      .setDescription("Voici l'URL du code source :  https://gitlab.com/flofan/furbot")
      .addField("Packets utilisées :", "- discord.js : https://www.npmjs.com/package/discord.js \n- snekfetch : https://www.npmjs.com/package/snekfetch \n- @zuzak/owo : https://www.npmjs.com/package/@zuzak/owo \n- fur-node : https://www.npmjs.com/package/furaffinity \n- death : https://www.npmjs.com/package/death")
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content == prefix + "info") {
    let embed = new Discord.RichEmbed()
      .setColor(message.member.colorRole.hexColor)
      .setTitle("**__Informations__**")
      .setDescription("Informations relatives aux bots")
      .addField("Version", version)
      .addField("Ping", client.ping)
      .addField("Bot crée par", "Flo - Fan")
      .setFooter('Pour voir le code source : ' + prefix + 'git')
    message.channel.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content.startsWith(prefix + "e621")) {
    var args = message.content.split(" ")
    if (!message.channel.nsfw) {
      var embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(":warning: ERREUR :warning:")
        .setDescription("Merci d'utiliser cette commande dans un channel NSFW.\nIl ne faudrait pas choquer les jeunes.")
      message.author.lastMessage.delete()
      message.channel.send(embed)
      
    }else if(args.length < 2){
      var embed = new Discord.RichEmbed()
        .setAuthor("E621", "https://cdn6.aptoide.com/imgs/0/7/f/07f23fe390d6d20f47839932ea23c678_icon.png?w=120", "http://e621.net")
        .setColor("#0000ff")
        .addField("Utilisation", "`"+ prefix +"e621 <tags>`", true)
        // rating:s (safe; questionable; explicit)
        .addField("Astuce", "Vous pouvez choisir le type de contenu voulu (NSFW ou non) avec ces tags : \n- `rating:s` : Safe / Pas de porno \n- `rating:q` : Questionable / Limite entre les deux  \n- `rating:e` : Explicit / Du yiff du yiff et encore du yiff")
        .addField("Exemple", "`" + prefix + "e621 protogen rating:s`" + "\nVa rechercher une image de protogen qui est safe (sans porno).")
      message.author.lastMessage.delete()
      message.channel.send(embed)
    }else{
      var str = ""

      for (var test in args) {
        if (test == 0) continue;
        str = str + args[test] + "+"
      }
      message.author.lastMessage.delete()
      SearchE621(message, str)
    }    
  }

  if (message.content.startsWith(prefix + "furtest")) {
    var args = message.content.split(" ")
    if (args.length > 1) {
      var i = Math.floor((Math.random() * (100 - 1) + 1))

      var embed = new Discord.RichEmbed()
        .setTitle("Furtest")
        .setDescription(args[1] + " est furry à " + i + "%.")
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

  var rdn = Math.floor((Math.random() * 5 + 1))

  switch (rdn) {
    case 1:
      client.user.setPresence({
        game: {
          name: "Happyness noises",
          type: "STREAMING",
          url: "https://gitlab.com/flofan/furbot"
        }
      })
      break
    case 2:
      client.user.setPresence({
        game: {
          name: "OwO What's this",
          type: "WATCHING",
          url: "https://gitlab.com/flofan/furbot"
        }
      })
      break
    case 3:
      client.user.setPresence({
        game: {
          name: "TheOdd1sout the furry",
          type: "WATCHING",
          url: "https://gitlab.com/flofan/furbot"
        }
      })
      break
    case 4:
      client.user.setPresence({
        game: {
          name: "Beep Boop. I'm a protogen",
          type: "STREAMING",
          url: "https://gitlab.com/flofan/furbot"
        }
      })
      break
    case 5:
      client.user.setPresence({
        game: {
          name: "Hug & cuddle",
          type: "STREAMING",
          url: "https://gitlab.com/flofan/furbot"
        }
      })
      break


    default:
      client.user.setPresence({
        game: {
          name: "Beep Boop. I'm a protogen"
        }
      })
      break;
  }

}

async function SearchE621(message, tags){
  // rating:s (safe; questionable; explicit)
  try {
    const {
      body
    } = await snekfetch
      .get('https://e621.net/post/index.json?tags=' + tags + '&limit=40')
    
    if (!body.length) return message.channel.send('Rien n\'a été trouvé');
    const randomnumber = Math.floor(Math.random() * body.length)
    const embed = new Discord.RichEmbed()
      .setAuthor("E621", "https://cdn6.aptoide.com/imgs/0/7/f/07f23fe390d6d20f47839932ea23c678_icon.png?w=120", "http://e621.net")
      .setDescription("Posté par: " + body[randomnumber].author)
      .setImage(body[randomnumber].file_url)
      .addField("Autres informations :", ":star: " + body[randomnumber].fav_count)
      .addField("URL", "https://e621.net/post/show/" + body[randomnumber].id)
      .setFooter(body[randomnumber].tags)
      .setURL(body[randomnumber].url)
      .setColor("#0000ff")
      // https://e621.net/post/show
    message.channel.send(embed)
  } catch (err) {
    return console.error(err);
  }
}

function SearchFA(message, search) {
  let {
    Search,
    Type,
    Species,
    Gender
  } = require('furaffinity');
  Search(search, Type.Artwork).then(data => {
    // let rnd = Math.floor(Math.random() * data.length)
    try {
      data[0].getSubmission().then(sub => {
          const embed = new Discord.RichEmbed()
            .setAuthor("Furaffinity", "https://i1.wp.com/irishfurries.com/wp-content/uploads/2016/05/fa_logo.png?fit=200%2C200&ssl=1", "http://www.furaffinity.net/")
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
            .addField("Détails", err + "\n\n Recherche causant l'erreur : `" + search + "`")
            .addField("Veuillez réessailler avec d'autres mots", "Si l'erreur persiste, ouvrez une issue sur le git FurBot (" + prefix + "git)")
          message.channel.send(embed)
          client.fetchUser("232130062529331200").then(user => user.send(embed))
          console.error(err)
        })
    } catch (err) {
      const embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(":warning: ERREUR 404 :warning:")
        .setDescription("Aucune image de trouvée")
      message.channel.send(embed)
      console.log("Possibility of 404 : " + err)
    }

  })
}

async function SearchFurryIRL(message) {
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
    return console.error(err);
  }
}

client.login(config.configs.token);