// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
const config = require("../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
// Archivos
const botinfo = require("../version.json");
const ranks = require("../bot_data/public_ranks.json");

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let rangosActivo = config.rangos_activo;
  if(rangosActivo === "false") { return message.channel.send(`**ERROR:** La asignación de rangos está desactivada.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Debes escribir los comandos en el canal **#${config.canal_comandos}**!`);
  }
  if(args.length < 2) return message.channel.send(`:poop: Escribe el rango que quieres añadir. Uso: **${config.prefijo}rango (rango)**`);
  if(args[1] === "lista") {
    let listaEmbed = new Discord.RichEmbed()
    .setAuthor(`LISTA DE RANGOS`, message.guild.iconURL)
    .setColor("#6fc655")
    .setDescription(`Estos son los rangos que puedes añadir a tu perfil de **${message.guild.name}**.\n\n${rankList(message)}`);
    message.channel.send(listaEmbed);
  } else {
    // Comprobar que tiene nivel suficiente
    con.query(`SELECT * FROM usuarios WHERE id='${message.author.id}' and servidor='${message.guild.id}'`, (err, rows) => {
      if(err) throw err;
      let sql;
      if(rows.length < 1) {
        sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${message.author.id}', '0', '1', '${message.guild.id}')`;
        con.query(sql);
        return;
      } else {
        let nivel = rows[0].nivel;
        if(nivel >= 3) {
          // Comprobar si el rango está en la lista
          let rango = args[1];
          let rangosAceptados = ranksExist(message, rango);
          if(!rangosAceptados) {
            return message.channel.send(`:poop: Ese rango no está en la lista! **${config.prefijo}rango lista**`);
          };
          let rangoAdd = message.guild.roles.find(`name`, rango);
          if(!rangoAdd) return message.channel.send(`:poop: No encontramos ese rango. Contacta con un administrador.`);
          if(message.member.roles.has(rangoAdd.id)) {
            return message.channel.send(`:poop: Ya tienes ese rango en tu perfil!`)
          } else {
            message.member.addRole(rangoAdd.id);
            let rankEmbed = new Discord.RichEmbed()
            .setAuthor(`RANGO AÑADIDO!`, message.guild.iconURL)
            .setColor("#6fc655")
            .setDescription(`${message.author.username} ha añadido **${rangoAdd}** a su perfil!`)
            .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
            message.channel.send(rankEmbed);
          };
        } else {
          return message.channel.send(`:poop: Debes tener al menos **Nivel 3** para añadir rangos a tu perfil.`);
        }
      }
    });
  }
}

function rankList(message) {
  let serverID = message.guild.id;
  let rankList = ranks[serverID];
  return rankList.map(r => `- ${r}`).join("\n");
}

function ranksExist(message, rango) {
  let serverID = message.guild.id;
  let rankList = ranks[serverID];
  for (var i = 0; i < rankList.length; i++) {
    if(rango==rankList[i]) {
      return true;
      break;
    }
  }
}

exports.info = {
  name: "rango",
  alias: ["rank", "juego"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Añade un rango a tu perfil.",
  usage: "rango (rango)"
};
