const snekfetch = require('snekfetch'); // https://www.npmjs.com/package/snekfetch
const Discord = require('discord.js'); // https://www.npmjs.com/package/discord.js

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var language = JSON.parse(fs.readFileSync('language/' + config.configs.language + '.json', 'utf8'))

var Search = {
    SearchE621 : async function(message, tags, args) {
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
                .setDescription(language.e621.success.description.replace("%author%", body[randomnumber].author))
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
    },
    
    SearchFA : function(message, search) {
        let {
            Search,
            Type,
            Species,
            Gender,
            Category,
            Rating
        } = require('./lib/fa_integration');
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
                            .addField(language.furaffinity.error.retry.title, language.furaffinity.error.retry.text.replace("%prefix%", config.configs.prefix))
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
    },
    
    SearchFurryIRL : async function (message) {
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
}

module.exports = Search