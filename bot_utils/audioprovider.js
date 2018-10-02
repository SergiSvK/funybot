// ===========================================
// AudioProvider
// ===========================================
// Módulos
const Discord = require("discord.js");
const YTDL = require('ytdl-core');
const YTF = require('youtube-finder');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
// Constructores
var guilds = {};
const ytclient = YTF.createClient({key: config.youtube_apikey});

exports.queueSong = (message, searchString) => {
    var guildId = message.guild.id;
    if(!guilds[guildId]) guilds[guildId] = {
        playQueue: [],
        nowPlaying: null
    };
    var g = guilds[guildId];
    var params = {
        part: 'id',
        q: searchString,
        maxResults: 1,
        type: 'video'
    }
    ytclient.search(params, function(err, data) {
        if(data.items.length == 0){
          message.channel.send(`:poop: No has añadido ninguna canción! Escribe **${config.prefijo}youtube** para más info.`);
          return;
        }
        var vidId = data.items[0].id.videoId;
        YTDL.getInfo(vidId, (err, info) => {
          var song = {
            id: vidId,
            title: vidId,
            length: info.length_seconds
          };
          if(!err) song.title = info.title;

          let ytVidUrl = "https://www.youtube.com/watch?v=" + song.id;
          let min = ~~(song.length / 60);
          let sec = ('0' + ~~(song.length % 60)).slice(0, 2);
          let vidL = "`" + min + ":" + sec + "`";

          var embed = new Discord.RichEmbed()
          .setColor("#bb2c2c")
          .setAuthor(`Añadido a la lista - Música YouTube`, `https://i.imgur.com/UavYrBp.png`)
          .setDescription(`[${song.title}](${ytVidUrl}) | ${vidL}`)
          .setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
          message.channel.send(embed);
          g.playQueue.push(song);
          if(!message.guild.voiceConnection){
            message.member.voiceChannel.join().then((connection) => {
              playSong(connection, guildId);
            });
          }
        });
    });
};

function playSong(connection, guildId) {
    var g = guilds[guildId];
    g.dispatcher = connection.playStream(YTDL(g.playQueue[0].id, {filter: "audioonly", quality: "highestaudio"}));
    g.nowPlaying = g.playQueue[0];
    g.playQueue.shift();
    g.dispatcher.on("end", end => {
      if(g.playQueue[0]) {
        playSong(connection, guildId);
      } else {
        connection.disconnect();
      }
    });
}

exports.pauseSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.pause();
};

exports.resumeSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.resume();
};

exports.skipSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.end();
};

exports.stopSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    g.playQueue = [];
    if(g.dispatcher) g.dispatcher.end();
};

exports.playQueue = (message, guildId, channel) => {
    if(!guilds[guildId]) return message.channel.send(":poop: No hay música en reproducción ni en espera!");
    var g = guilds[guildId];
    var q = "";
    var i = 1;
    let ytBaseUrl = "https://www.youtube.com/watch?v=";
    g.playQueue.forEach((song) => {
        let ytLink = ytBaseUrl + song.id;
        q += "`" + i++ + "`. ";
        q += `[${song.title}](${ytLink}) | `;
        q += "`" + song.length + "`\n";
    });

    var currSong = `[${g.nowPlaying.title}](${ytBaseUrl+g.nowPlaying.id}) | `;
    currSong += "`" + g.nowPlaying.length + "`";

    var embed = new Discord.RichEmbed();
    embed.setColor('#bb2c2c');
    embed.setAuthor(`Lista de reproducción - Música YouTube`, `https://i.imgur.com/UavYrBp.png`);
    embed.addField(":musical_note: Reproduciendo", currSong);
    if(q) {
      embed.addField(":notes: En espera", q);
    }
    embed.setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
    channel.send(embed);
}
