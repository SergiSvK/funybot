// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const mysql = require("mysql");
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.perfil_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) {
      return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
    };
  }
  let target = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;
  // Conexión a la base de datos y comprobar datos
  con.query(`SELECT * FROM usuarios WHERE id='${target.id}' and servidor='${message.guild.id}'`, (err, rows) =>{
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${target.id}', '0', '1', '${message.guild.id}')`;
      con.query(sql);
      return;
    }
    let nivel = rows[0].nivel;
    let dinero = rows[0].dinero;
    let sugerencias = rows[0].sugerencias;
    let reportes = rows[0].reportes;
    let lvlEmbed = new Discord.RichEmbed()
    .setAuthor(`Perfil de ${target.username}`)
    .setThumbnail(target.displayAvatarURL)
    .setColor("#9252cb")
    .setDescription(`Actualmente eres **Nivel ${nivel}** y tienes **${dinero} ${config.moneda_plural}** en tu Monedero.\nHas enviado **${sugerencias} sugerencias** y tienes **${reportes} reportes**.`)
    .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    message.channel.send(lvlEmbed);
  });
}

exports.info = {
  name: "perfil",
  alias: ["profile"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra tu perfil o el de un miembro.",
  usage: "perfil [usuario]"
};
