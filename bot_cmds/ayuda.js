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

exports.execute = (bot, message, args) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.ayuda_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }
  if (!args[1]) {
      command = bot.commands.get('ayuda');
      let embed = new Discord.RichEmbed()
      .setAuthor(`Lista de Comandos - ${botinfo.nombre}`, botinfo.imagen)
      .setColor(config.color)
      .setDescription(`${bot.commands.map(c => `- **${config.prefijo}${c.info.name}**: ${c.info.description}`).join("\n")}\n\nEscribe **${config.prefijo}${command.info.usage}** para más info.`)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      message.channel.send(embed);
  } else {
    let command = args[1];
    if(bot.commands.has(command)) {
      command = bot.commands.get(command);
      let embed = new Discord.RichEmbed()
      .setAuthor(`Información del comando ${config.prefijo}${command.info.name} - ${botinfo.nombre}`, message.guild.iconURL)
      .setColor(config.color)
      .setDescription(`${command.info.description}\nUso: ${config.prefijo}${command.info.usage}`)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      message.channel.send(embed);
    }
  }
}

exports.info = {
  name: "ayuda",
  alias: ["cmd", "cmds", "comandos", "help"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra una lista de los comandos disponibles.",
  usage: "ayuda [comando]"
};
