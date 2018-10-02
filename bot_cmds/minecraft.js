// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const request = require('request');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
const errors = require("../bot_utils/errores.js");
var ap = require('../bot_utils/audioprovider.js');

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.minecraft_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) {
      return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
    };
  }
  if(args[1] === "server" || args[1] === "servidor" || args[1] === "sv") {
    var mcIP = args[2];
    var mcPort = 25565;
    var url = 'https://api.mcsrvstat.us/1/' + mcIP;
    request(url, function(err, response, body) {
      if(err) {
        console.error(err);
        return message.reply('**ERROR**: No podemos ofrecerte información de ese servidor.');
      }
      body = JSON.parse(body);
      let status = body.debug["ping"];
      if(status) {
        let online = body.debug["ping"];
        if(online) { online = "Online" } else { online = "Offline" };
        let players = body.players["online"];
        let motd1 = body.motd["clean"]["0"];
        let motd2 = body.motd["clean"]["1"];
        let version = body.version;
        let ip = body.hostname;
        let embed = new Discord.RichEmbed()
        .setColor("#9fcf62")
        .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/` + ip)
        .setAuthor(`Servidor de Minecraft (${args[2]})`, `https://i.imgur.com/REo1K0C.png`)
        .setDescription(`${motd1}\n${motd2}\n\n**Estado**: ${online}\n\n**Jugadores Online**: ${players}\n\n**IP**: ${ip}\n\n**Versión**: ${version}\n`)
        .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
        message.channel.send(embed);
      }
    });
  }

}

exports.info = {
  name: "minecraft",
  alias: ["mc", "mine"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Estado de minecraft.net, información de servidores, etc.",
  usage: "minecraft"
};
