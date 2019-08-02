const version = "1.0"

const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js
const client = new Discord.Client();
const snekfetch = require('snekfetch'); // https://www.npmjs.com/package/snekfetch
const owo = require('@zuzak/owo') // https://www.npmjs.com/package/@zuzak/owo

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

try {
  var language = JSON.parse(fs.readFileSync('language/' + config.configs.language + '.json', 'utf8'))

} catch (err) {
  console.log(err)
  client.destroy()
  process.exit()
}

const prefix = config.configs.prefix

var ON_DEATH = require('death'); //this is intentionally ugly

ON_DEATH(function (signal, err) {
  client.destroy()
  process.exit()
})

client.on('ready', () => {
  console.log(`Bot lancé : ${client.user.tag}.`);
  client.user.setPresence({
    game:{
      name:"Bot started."
    }
  })
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
        .setTitle(language.global.error)
        .setDescription(language.furaffinity.info.noargument)
        .addField(language.furaffinity.info.example.title, language.furaffinity.info.example.text.replace("%prefix%", prefix))
      message.author.lastMessage.delete()
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
      .setColor("#0e2e33")
      .setTitle(language.help.title)
      .setDescription(language.help.description.replace("%prefix%", prefix))
    for (var com in language.help.commands) {
      embed.addField(prefix + language.help.commands[com].usage, language.help.commands[com].description)
    }
    embed.setFooter(language.help.footer)
    message.author.send(embed)
    message.author.lastMessage.delete()
  }

  if (message.content == prefix + "git") {
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
    if (!message.channel.nsfw) {
      var embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(language.global.error)
        .setDescription(language.e621.error.nonsfw)
      message.author.lastMessage.delete()
      message.channel.send(embed)

    } else if (args.length < 2) {
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
        .setTitle(language.furtest.title)
        .setDescription(language.furtest.title.description.replace("%player%", args[1]).replace("%percent%", i))
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

  var rpcjson = JSON.parse(fs.readFileSync("richpresence.json", "utf8"))
  var rdn = Math.floor((Math.random() * (rpcjson.rpc.length - 1) + 0))

  client.user.setPresence({
    game: {
      name: rpcjson.rpc[rdn].text,
      type: rpcjson.rpc[rdn].type
    }
  })
}

async function SearchE621(message, tags, args) {
  // rating:s (safe; questionable; explicit)
  try {
    const {
      body
    } = await snekfetch
      .get('https://e621.net/post/index.json?tags=' + tags + '&limit=320')

    if (!body.length) return message.channel.send(new Discord.RichEmbed()
      .setAuthor(language.e621.author.name, language.e621.author.icon_url, language.e621.author.url)
      .setColor("#ff0000")
      .setTitle(language.global.error)
      .setDescription(language.e621.error.notfound)

    );
    const randomnumber = Math.floor(Math.random() * body.length)
    const embed = new Discord.RichEmbed()
      .setAuthor(language.e621.author.name, language.e621.author.icon_url, language.e621.author.url)
      .setDescription(language.e621.success.description.replace("%author", body[randomnumber].author))
      .setImage(body[randomnumber].file_url)
      .addField(language.e621.success.other.title, language.e621.success.other.text.replace("%fav%", body[randomnumber].fav_count))
      .addField(language.e621.success.url.title, language.e621.success.url.text.replace("%url%", "https://e621.net/post/show/" + body[randomnumber].id))
      .setFooter(language.e621.success.footer.replace("%tags%", body[randomnumber].tags))
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
    Gender,
    Category,
    Rating
  } = require('furaffinity');
  Search(search, {
    type: Type.Artwork,
    rating: Rating.General
  }).then(data => {
    // let rnd = Math.floor(Math.random() * data.length)
    try {
      data[0].getSubmission().then(sub => {
          const embed = new Discord.RichEmbed()
            .setAuthor(language.furaffinity.author.name, language.furaffinity.author.icon_url, language.furaffinity.author.url)
            .setColor("#be8e6b")
            .setTitle(sub.title)
            .setDescription(language.furaffinity.success.description.replace("%author%", sub.author.name))
            .setImage(sub.image.url)
            .addField(language.furaffinity.success.stats.title, language.furaffinity.success.stats.text.replace("%favorites%", sub.stats.favorites).replace("%comments%", sub.stats.comments).replace("%views%", sub.stats.views))
            .addField(language.furaffinity.success.info.title, language.furaffinity.success.info.text.replace("%species%", Species[sub.content.species]).replace("%category%", Category[sub.content.category]).replace("%gender%", Gender[sub.content.gender]))
            .setURL(sub.url)
            .setFooter(language.furaffinity.success.footer.replace("%tags%", sub.keywords))
          message.channel.send(embed)
        })
        .catch(err => {
          const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTitle(language.global.error)
            .addField(language.furaffinity.error.details.title, language.furaffinity.error.details.text.replace("%err%", err).replace("%search%", search))
            .addField(language.furaffinity.error.retry.title, language.furaffinity.error.retry.text.replace("%prefix%", prefix))
          message.channel.send(embed)
          console.error(err)
        })
    } catch (err) {
      const embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setTitle(language.global.error)
        .setDescription(language.furaffinity.error.notfound)
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
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send(new Discord.RichEmbed()
      .setAuthor(language.furryirl.author.name, language.furryirl.author.icon_url, language.furryirl.author.url)
      .setColor("#ff0000")
      .setTitle(language.global.error)
      .setDescription(language.furryirl.error.notfound)
    );
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const embed = new Discord.RichEmbed()
      .setAuthor(language.furryirl.author.name, language.furryirl.author.icon_url, language.furryirl.author.url)
      .setTitle(allowed[randomnumber].data.title)
      .setDescription(language.furryirl.success.description.replace("%author", allowed[randomnumber].data.author))
      .setImage(allowed[randomnumber].data.url)
      .addField(language.furryirl.success.other.title, language.furryirl.success.other.text.replace("%upvotes%", allowed[randomnumber].data.ups).replace("%comments%", allowed[randomnumber].data.num_comments))
      .setFooter(language.furryirl.success.footer)
      .setURL(allowed[randomnumber].data.url)
      .setColor("#ef5704")
    message.channel.send(embed)
  } catch (err) {
    return console.error(err);
  }
}

client.login(config.configs.token);