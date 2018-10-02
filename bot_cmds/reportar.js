// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const dateFormat = require('dateformat');
const CodeGenerator = require('node-code-generator');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
const errors = require("../bot_utils/errores.js");
// Generadores
var now = new Date();

exports.execute = (bot, message, args) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.reportes_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name)return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }
  if (args.length < 3) return message.channel.send(`:poop: Debes escribir un reporte. Uso: ${config.prefijo}reportar @usuario (mensaje)`);
  let fecha = dateFormat(now, "dd/mm/yyyy h:MM:ss TT");
  let codigo = generarCodigo();
  let reportUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!reportUser) return message.channel.send(":poop: No has escrito el usuario correctamente.");
  let reportReason = args.join(" ").slice(args[0].length + args[1].length + 1);
  let reportEmbed = new Discord.RichEmbed()
  .setAuthor(`REPORTE #${codigo}`)
  .setColor("#d52d2d")
  .addField("Usuario Reportado", reportUser, true)
  .addField("ID del usuario", reportUser.id, true)
  .addField("Razón", reportReason)
  .setFooter(`Enviado por ${message.author.username} - ${fecha}`);
  let reportsChannel = message.guild.channels.find("name", config.canal_reportes);
  if(!reportsChannel) return;
  message.delete().catch(O_o=>{});
  reportsChannel.send(reportEmbed);
}

function generarCodigo(){
  var generator = new CodeGenerator();
  var pattern = '######';
  var howMany = 1;
  var options = {};
  var code = generator.generateCodes(pattern, howMany, options);
  return code;
}

exports.info = {
  name: "reportar",
  alias: ["report"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Reporta a un miembro del servidor.",
  usage: "reportar @usuario (razón)"
};
