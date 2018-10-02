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
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message);
  if(!args[1]) return message.channel.send(":pencil: Escribe el número de mensajes que quieres eliminar. Ej: !eliminar 10");
  message.channel.bulkDelete(args[1]).then(() => {
    message.channel.send(`:white_check_mark: Se han eliminado todos los mensajes!`).then(msg => msg.delete(2000));
  });
}

exports.info = {
  name: "eliminar",
  alias: ["remove", "delete"],
  permission: "staff",
  type: "general",
  guildOnly: true,
  description: "Elimina una cantidad de mensajes del canal. (Staff)",
  usage: "eliminar (cantidad)"
};
