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
const errors = require("../bot_utils/errores.js");
var ap = require('../bot_utils/audioprovider.js');

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  /*let cmdActivo = config.youtube_activo;
  if(cmdActivo === "false") return message.channel.send(`**ERROR:** El comando está desactivado.`);
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }*/
  // Comandos de ayuda
  if(args.length < 2) {
    let embed = new Discord.RichEmbed()
    .setColor("#bb2c2c")
    .setAuthor(`Comandos - Música de YouTube`, `https://i.imgur.com/UavYrBp.png`)
    .addField('Añadir música', `${config.prefijo}yt (play/reproducir) (titulo/url)`)
    .addField('Ver lista de espera', `${config.prefijo}yt (lista/list)`)
    .addField('Pausar la música', `${config.prefijo}yt (pausar/pause)`)
    .addField('Reanudar la música', `${config.prefijo}yt (reanudar/resume)`)
    .addField('Parar la música y sacar al bot', `${config.prefijo}yt (stop/parar)`)
    .addField('Pasar al siguiente tema musical', `${config.prefijo}yt (skip/siguiente/next)`)
    .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    return message.channel.send(embed);
  }

  if(!message.member.voiceChannel) {
    return message.channel.send(`:poop: Debes entrar al canal de voz **${config.youtube_canalvoz}**.`);
  }
  if(message.member.voiceChannel.name !== config.youtube_canalvoz) {
    return message.channel.send(`:poop: No estás en el canal de voz **${config.youtube_canalvoz}**.`);
  }

  // Añadir música a la lista de reproducción
  if(args[1] === "play" || args[1] === "reproducir") {
    var botUserId = bot.user.id;
    if(!message.member.voiceChannel.members.get(botUserId) && !message.member.voiceChannel.joinable) {
      return message.channel.send(":poop: No puedo entrar al canal. Quizás está lleno.");
    }
    args.shift();
    var searchString = args.join(" ");
    ap.queueSong(message, searchString);
    return;
  }
  // Pausar la música
  if(args[1] === "pausar" || args[1] === "pause") {
    message.channel.send(`:pause_button: **${message.author.username}** ha pausado la música.`).then(function (message){
      ap.pauseSong(message.guild.id)
    });
  }
  // Parar la música y sacar al bot
  if(args[1] === "stop" || args[1] === "parar") {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":poop: Sólo el staff puede para la música.");
    message.channel.send(`:stop_button: **${message.author.username}** ha parado la música.`).then(function (message){
      ap.stopSong(message.guild.id)
    });
  }
  // Pasar al siguiente tema
  if(args[1] === "skip" || args[1] === "siguiente" || args[1] === "next") {
    message.channel.send(`:track_next: **${message.author.username}** ha pasado a la siguiente canción.`).then(function (message){
      ap.skipSong(message.guild.id)
    });
  }
  // Resproducir música parada
  if(args[1] === "reanudar" || args[1] === "resume") {
    message.channel.send(`:arrow_forward: **${message.author.username}** ha reactivado la música.`).then(function (message){
      ap.resumeSong(message.guild.id)
    });
  }
  // Lista de reproducción
  if(args[1] === "lista" || args[1] === "list") {
    ap.playQueue(message, message.guild.id, message.channel);
  }
}

exports.info = {
  name: "youtube",
  alias: ["yt"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Reproduce música de youtube en un canal de voz.",
  usage: "youtube"
};
