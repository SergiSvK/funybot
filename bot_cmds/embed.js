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
  if(!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message);
  const sayMessage = args.join(" ").slice(args[0].length);
  message.delete().catch();
  let myEmbed = new Discord.RichEmbed()
  .setColor("#272727")
  .setDescription(sayMessage);
  message.channel.send(myEmbed);
}

exports.info = {
  name: "embed",
  alias: [],
  permission: "admin",
  type: "general",
  guildOnly: true,
  description: "Escribe en un mensaje embebido. (Admin)",
  usage: "embed (mensaje)"
};
