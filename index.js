const Discord = require('discord.js');
const client = new Discord.Client();
const snekfetch = require('snekfetch');
const owo = require('@zuzak/owo')

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "noise intensifies"
    }
  })
});

client.on('message', message => {
  if (message.content === config.configs.prefix + 'furryirl') {
    search(message)
  }

  if(message.content.startsWith(config.configs.prefix + "owofy")) {
    var args = message.content.split(" ")
    var str = ""

    for(var test in args){
      if(test == 0) continue;
      str = str + " " + args[test]
    }

    message.channel.send(owo(str))
  }

});

async function search(message){
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
      // .setColor(0x00A2E8)
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