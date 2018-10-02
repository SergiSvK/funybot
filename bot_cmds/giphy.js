// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
const errors = require("../bot_utils/errores.js");
// Módulos
const Discord = require("discord.js");
const giphy = require('giphy-api')(config.giphy_apikey);

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.giphy_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_gifs;
    if(cmdChannel !== message.channel.name) {
      return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_gifs}**!`);
    };
  }
  if (args.length < 2) {
    // Gif random
    giphy.random().then(function (res) {
      let randomGif = new Discord.RichEmbed()
      .setAuthor(`GIF RANDOM - giphy.com`, `https://i.imgur.com/NTG7tnV.png`)
      .setColor("#747474")
      .setImage(res.data.images.original.url)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      message.channel.send(randomGif);
    });
  } else {
    // Gif random con palabra
    var tagGif = args[1];
    giphy.random(tagGif).then(function (res) {
      let randomGif = new Discord.RichEmbed()
      .setAuthor(`GIF RANDOM (${tagGif}) - giphy.com`, `https://i.imgur.com/NTG7tnV.png`)
      .setColor("#747474")
      .setImage(res.data.images.original.url)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      message.channel.send(randomGif);
    });
  }
}

exports.info = {
  name: "giphy",
  alias: ["gif"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra gifs random de la página giphy.com.",
  usage: "gif (texto)"
};
