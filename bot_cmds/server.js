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

exports.execute = (bot, message, args) => {
  let fecha = dateFormat(message.guild.joinedAt, "dd/mm/yyyy h:MM:ss TT");
  let embed = new Discord.RichEmbed()
  .setColor(config.color)
  .setThumbnail(message.guild.iconURL)
  .setDescription(config.descripcion)
  .setAuthor(message.guild.name, message.guild.iconURL)
  .addField('ID', message.guild.id, true)
  .addField('Region', message.guild.region, true)
  .addField('Creado el', fecha, true)
  .addField('Dueño del Servidor', message.guild.owner.user.username+'#'+message.guild.owner.user.discriminator, true)
  .addField('Miembros', message.guild.memberCount, true)
  .addField('Rangos', message.guild.roles.size, true)
  .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
  message.channel.send(embed);
}

exports.info = {
  name: "server",
  alias: ["servidor", "sv", "serverinfo"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Información sobre el servidor.",
  usage: "sv"
};
