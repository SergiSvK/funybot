// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
const fortunaRespuestas = require("../bot_data/fortuna.json");
// Cooldown
const cdFortuna = new Set();

exports.execute = (bot, message, args) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.fortuna_activo;
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
  if (cdFortuna.has(message.author.id)) {
    message.channel.send(`:poop: Debes esperar 5 minutos para abrir otra galleta de la fortuna!`);
  } else {
    var respuestas = fortunaRespuestas;
    let mensajeRandom = respuestas[Math.floor(Math.random() * respuestas.length)];
    let galletaFortuna = new Discord.RichEmbed()
    .setAuthor(`GALLETA DE LA FORTUNA`, `https://i.imgur.com/hxH98Pv.png`)
    .setThumbnail(`https://i.imgur.com/9CSX0Db.png`)
    .setColor("#ffce6f")
    .setDescription(`${mensajeRandom}`)
    .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    message.channel.send(`**${message.author.username}** ha abierto una galleta de la fortuna!`);
    message.channel.send(galletaFortuna);
    cdFortuna.add(message.author.id);
    setTimeout(() => {cdFortuna.delete(message.author.id);},300000);
  }
}

exports.info = {
  name: "fortuna",
  alias: ["fortune", "fort", "galleta"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Abre una galleta de la fortuna.",
  usage: "fortuna"
};
