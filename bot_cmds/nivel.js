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
  let cmdActivo = config.nivel_activo;
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
  // Conexión a la base de datos y comprobar datos
  con.query(`SELECT * FROM usuarios WHERE id='${message.author.id}' and servidor='${message.guild.id}'`, (err, rows) =>{
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${message.author.id}', '${generateXp()}', '1', '${message.guild.id}')`;
      con.query(sql);
    }
    let currentExp = rows[0].exp;
    let currentLvl = rows[0].nivel;
    let nextLvl = currentLvl + 1;
    let nextLvlXp = currentLvl * 300;
    let diffExp = nextLvlXp - currentExp;
    let lvlEmbed = new Discord.RichEmbed()
    .setAuthor(`Nivel de ${message.author.username}`)
    .setThumbnail(message.author.displayAvatarURL)
    .setColor("#ffc700")
    .setDescription(`Actualmente eres **Nivel ${currentLvl}**, y tienes **${currentExp}/${nextLvlXp}xp**.\nPara alcanzar el **Nivel ${nextLvl}**, necesitas **${diffExp}xp**.\n\n*Sigue participando para desbloquear más funciones!*`)
    .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    message.channel.send(lvlEmbed);
  });
}

exports.info = {
  name: "nivel",
  alias: ["level", "lvl"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra tu nivel y experiencia.",
  usage: "nivel"
};
