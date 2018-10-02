// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const mysql = require("mysql");
const dateFormat = require('dateformat');
const CodeGenerator = require('node-code-generator');
// Archivos
const config = require("../config.json");
const errors = require("../bot_utils/errores.js");
// Constructores
var now = new Date();

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.sugerencias_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }
  if (args.length < 2) return message.channel.send(`:poop: Debes escribir una sugerencia. Uso: ${config.prefijo}sugerencia (mensaje)`);
  let codeSug = generarCodigo();
  let sugerencia = args.join(" ").slice(args[0].length);
  let fecha = dateFormat(now, "dd/mm/yyyy h:MM:ss TT");
  let sugEmbed = new Discord.RichEmbed()
  .setAuthor(`SUGERENCIA #${codeSug}`)
  .setColor("#ff8d45")
  .setDescription(sugerencia)
  .setFooter(`Enviado por ${message.author.username} - ${fecha}`);
  let sugerenciaChannel = message.guild.channels.find("name", config.canal_sugerencias);
  if(!sugerenciaChannel) return;
  message.delete().catch(O_o=>{});
  sugerenciaChannel.send(`**${message.author.username}** ha enviado una nueva sugerencia!`);
  sugerenciaChannel.send(sugEmbed).then(function (message){
    message.react("👎")
    message.react("👍")
  });
  // Incremento de sugerencias
  con.query(`SELECT * FROM usuarios WHERE id='${message.author.id}' and servidor='${message.guild.id}'`, (err, rows) => {
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${message.author.id}', '${generateXp()}', '1', '${message.guild.id}')`;
    } else {
      let currentSug = rows[0].sugerencias;
      let newSugDB = currentSug + 1;
      sql = `UPDATE usuarios SET sugerencias=${newSugDB} WHERE id='${message.author.id}' and servidor='${message.guild.id}'`;
    }
    con.query(sql);
  });
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
  name: "sugerencia",
  alias: ["suggerence", "sug"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Envia una sugerencia.",
  usage: "sugerencia (mensaje)"
};
