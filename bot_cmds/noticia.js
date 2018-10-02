// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
// Archivos
const errors = require("../bot_utils/errores.js");

exports.execute = (bot, message, args) => {
  const sayMessage = args.join(" ").slice(args[0].length);
  message.delete().catch();
  let myEmbed = new Discord.RichEmbed()
  .setAuthor(message.guild.name, message.guild.iconURL)
  .setColor("#272727")
  .setDescription(sayMessage);
  message.channel.send(myEmbed);
}

exports.info = {
  name: "noticia",
  alias: ["new"],
  permission: "admin",
  type: "general",
  guildOnly: true,
  description: "Escribe una noticia en nombre del servidor. (Admin)",
  usage: "noticia (mensaje)"
};
