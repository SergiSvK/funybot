// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const dateFormat = require('dateformat');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
const errors = require("../bot_utils/errores.js");
var ap = require('../bot_utils/audioprovider.js');

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.canal_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }
  if (args.length < 2) return message.channel.send(`:poop: Debes escribir un canal! Uso: ${config.prefijo}canal (canal)`);
  const types = {
  	dm: 'DM',
  	group: 'DM Grupal',
  	text: 'Canal de Texto',
  	voice: 'Canal de Voz',
  	category: 'Categoría',
  	unknown: 'Desconocido'
  };
  let chan = message.guild.channels.find("name", args[1]);
  let fecha = dateFormat(chan.createdAt, "dd/mm/yyyy h:MM:ss TT");
  const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .addField('Nombre', chan.type === 'dm' ? `@${chan.recipient.username}` : chan.name, true)
  .addField('ID', chan.id, true)
  .addField('NSFW', chan.nsfw ? 'Si' : 'No', true)
  .addField('Categoría', chan.parent ? chan.parent.name : 'Sin categoría', true)
  .addField('Tipo', types[chan.type], true)
  .addField('Creado', fecha, true)
  .addField('Descripción', chan.topic || 'Sin descripción')
  .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
  return message.channel.send(embed);
}

exports.info = {
  name: "canal",
  alias: ["chan", "cinfo"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Información del canal donde escribes este comando.",
  usage: "canal"
};
