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
  message.channel.send(sayMessage);
}

exports.info = {
  name: "botchat",
  alias: ["say", "bchat"],
  permission: "admin",
  type: "general",
  guildOnly: true,
  description: "Habla en nombre del bot. (Admin)",
  usage: "botchat (mensaje)"
};
