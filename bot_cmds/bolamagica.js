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
const bolamagicaRespuestas = require("../bot_data/bolamagica.json");
// Cooldown
const cdBolaMagica = new Set();

exports.execute = (bot, message, args) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.bolamagica_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }
  if (cdBolaMagica.has(message.author.id)) return message.channel.send(`:poop: Debes esperar 5 minutos para volver a hacer otra pregunta!`);
  if (args.length < 2) return message.channel.send('🔮 Debes hacerle una pregunta a la bola mágica!');
  var respuestas = bolamagicaRespuestas;
  let mensajeRandom = respuestas[Math.floor(Math.random() * respuestas.length)];
  const preguntaUser = args.join(' ').slice(args[0].length);
  let bolaMagica = new Discord.RichEmbed()
  .setAuthor(`BOLA MÁGICA`, `https://i.imgur.com/1s6xECe.png`)
  .setThumbnail(`https://i.imgur.com/1s6xECe.png`)
  .setColor("#6bc1ff")
  .addField(`Pregunta de ${message.author.username}`, preguntaUser)
  .addField(`La bola mágica dice...`,`${mensajeRandom}`)
  .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
  message.channel.send(`**${message.author.username}** ha preguntado a la bola mágica!`);
  message.channel.send(bolaMagica);
  cdBolaMagica.add(message.author.id);
  setTimeout(() => {cdBolaMagica.delete(message.author.id);},300000);
}

exports.info = {
  name: "8ball",
  alias: ["bolamagica", "bm", "8b"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Haz una pregunta a la bola mágica.",
  usage: "bm (pregunta)"
};
