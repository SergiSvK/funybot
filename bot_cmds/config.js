// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const fs = require("fs");

exports.execute = (bot, message, args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message);
  if(!args[1] && !args[2]) return message.channel.send("**ERROR:** Escribe una opción y un valor. Ej: !config color #000000");

  let myConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));

  let opcion = args[1];
  let valor = args[2];
  let optOk = "false";

  if (opcion === "nombre") {
    myConfig.nombre = valor;
    optOk = "true";
  };

  if (opcion === "color") {
    myConfig.color = valor;
    optOk = "true";
  };

  if (opcion === "descripcion") {
    myConfig.descripcion = valor;
    optOk = "true";
  };

  if (opcion === "tipo_actividad") {
    if(valor === "WATCHING" || valor === "PLAYING"){
      myConfig.tipo_actividad = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Tipos de actividad permitidos: WATCHING, PLAYING.");
    }
  };

  if (opcion === "actividad") {
    myConfig.actividad = valor;
    optOk = "true";
  };

  if (opcion === "prefijo") {
    myConfig.prefijo = valor;
    optOk = "true";
  };

  if (opcion === "copyright") {
    myConfig.copyright = valor;
    optOk = "true";
  };

  if (opcion === "bienvenida_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.bienvenida_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "reportes_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.reportes_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "sugerencias_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.sugerencias_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "nivel_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.nivel_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "bolamagica_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.bolamagica_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "fortuna_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.fortuna_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "juegos_activo") {
    if(valor === "true" || valor === "false"){
      myConfig.juegos_activo = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "requerir_canales") {
    if(valor === "true" || valor === "false"){
      myConfig.requerir_canales = valor;
      optOk = "true";
    } else {
      return message.channel.send("**ERROR:** Esa opción sólo permite un valor **true** o **false**.");
    }
  };

  if (opcion === "canal_comandos") {
    let canal = member.guild.channels.find("name", valor);
    if(!canal) return message.channel.send("**ERROR:** El canal ${valor} no existe.");
    myConfig.canal_comandos = valor;
    optOk = "true";
  };

  if (opcion === "canal_actividad") {
    let canal = member.guild.channels.find("name", valor);
    if(!canal) return message.channel.send("**ERROR:** El canal ${valor} no existe.");
    myConfig.canal_actividad = valor;
    optOk = "true";
  };

  if (opcion === "canal_bienvenida") {
    let canal = member.guild.channels.find("name", valor);
    if(!canal) return message.channel.send("**ERROR:** El canal ${valor} no existe.");
    myConfig.canal_bienvenida = valor;
    optOk = "true";
  };

  if (opcion === "canal_sugerencias") {
    let canal = member.guild.channels.find("name", valor);
    if(!canal) return message.channel.send("**ERROR:** El canal ${valor} no existe.");
    myConfig.canal_sugerencias = valor;
    optOk = "true";
  };

  if (opcion === "canal_reportes") {
    let canal = member.guild.channels.find("name", valor);
    if(!canal) return message.channel.send("**ERROR:** El canal ${valor} no existe.");
    myConfig.canal_reportes = valor;
    optOk = "true";
  };

  if(optOk === "false"){
    let configEmbed = new Discord.RichEmbed()
    .setAuthor(`La configuración no ha sido cambiada!`, message.guild.iconURL)
    .setColor("#f01313")
    .setDescription(`Comprueba que **${opcion}** sea una opción válida de configuración.`)
    message.channel.send(configEmbed);
  } else {
    let configEmbed = new Discord.RichEmbed()
    .setAuthor(`Configuración (${opcion}) cambiada!`, message.guild.iconURL)
    .setColor("#f0e013")
    .addField(opcion, valor)
    message.channel.send(configEmbed);
  }

  fs.writeFile("./config.json", JSON.stringify(config), (err) => {
    if (err) console.error(err)
  });
}

exports.info = {
  name: "config",
  alias: ["configuracion", "opciones"],
  permission: "admin",
  type: "hidden",
  guildOnly: true,
  description: "Cambiar la configuración del servidor. (Admin)",
  usage: "config (opcion) (valor)"
};
