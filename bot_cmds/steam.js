// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const request = require('request');
const steamID = require('steamid');
const moment = require('moment');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");
var steamCountries = require('../bot_data/steam_countries.min.json');

exports.execute = (bot, message, args) => {
  var steamIDString;

  if (args.length < 2) {
    steamIDString = message.author.username;
  } else {
    steamIDString = args[1];
  }

  // Comprobar si el comando está activo
  const cmdActivo = config.steam_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  const requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    const cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) {
      return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
    };
  }

  // Mostrar error si no hay un id definido
  if (steamIDString === undefined) {
    console.error("ERROR: El SteamID no está definido. (undefined)");
    return;
  }

  // Convertir en SteamID64
  request({url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + config.steam_apikey + "&vanityurl=" + steamIDString, json: true}, function(error, response, body){

  // Mostrar error si la APIKEY no es válida
  if (response.statusCode == 403) {
    console.error("ERROR: La APIKEY no es válida.");
    message.channel.send("**ERROR*** La API key no es válida. Contacta con un administrador.");
    return;
  }

  // Comprobar si el SteamID es un código de 17 dígitos
  if(/^\d+$/.test(steamIDString) && steamIDString.length == 17) {
    steamID64 = steamIDString;
    if(config.debug === "true"){console.log("DEBUG: (SteamID) " + steamID64);}
  }
  else if(body.response.success == 1){
    steamID64 = body.response.steamid;
    if(config.debug === "true"){console.log("DEBUG: (SteamID) " + steamID64);}
  }
  else if((matches = steamIDString.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/)) || (matches = steamIDString.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/))){
    var SteamID3 = new SteamID(steamIDString);
    steamID64 = SteamID3.getSteamID64();
    if(config.debug === "true"){console.log("DEBUG: (SteamID) " + steamID64);}
  }
  else {
    message.channel.send("**ERROR:** No encontramos la cuenta **" + steamIDString + "**.\nPosiblemente el id no sea correcto, el usuario no ha configurado la url de su perfil o tiene su perfil privado.");
    if(config.debug === "true"){console.error("ERROR: No se encuentra el nombre de usuario: " + steamIDString);}
    return;
  }

  // URL con información de steam
  var urls = ["http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=" + config.steam_apikey + "&steamid=" + steamID64,"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + config.steam_apikey + "&steamids=" + steamID64];

  // Generar todos los datos
  requestURL(urls, function(response) {
      steamUserData = {
          avatar: (JSON.parse(response[urls[1]].body).response.players[0].avatarfull),
          username: (JSON.parse(response[urls[1]].body).response.players[0].personaname),
          realname: (JSON.parse(response[urls[1]].body).response.players[0].realname),
          status : (JSON.parse(response[urls[1]].body).response.players[0].personastate),
          gameinfo : (JSON.parse(response[urls[1]].body).response.players[0].gameextrainfo),
          gameid : (JSON.parse(response[urls[1]].body).response.players[0].gameid),
          lobbysteamid : (JSON.parse(response[urls[1]].body).response.players[0].lobbysteamid),
          level : (JSON.parse(response[urls[0]].body).response.player_level),
          timecreated: (JSON.parse(response[urls[1]].body).response.players[0].timecreated),
          lastlogoff: (JSON.parse(response[urls[1]].body).response.players[0].lastlogoff),
          loccountrycode: (JSON.parse(response[urls[1]].body).response.players[0].loccountrycode),
          locstatecode: (JSON.parse(response[urls[1]].body).response.players[0].locstatecode),
          loccityid: (JSON.parse(response[urls[1]].body).response.players[0].loccityid),
      };
      sendUserEmbedMessage(message, steamUserData);
    });
  });
  // Construir embed con la información
  function sendUserEmbedMessage (message, steamUserData){
    var steamUserEmbed = new Discord.RichEmbed();
    steamUserEmbed.setAuthor(`STEAM - Perfil de ${steamIDString}`, `https://i.imgur.com/3LNiIBb.png`)
    steamUserEmbed.setThumbnail(steamUserData.avatar);
    steamUserEmbed.addField(`Nick`, `${steamUserData.username}`, true );
    /*if (steamUserData.realname === undefined){
      steamUserEmbed.addField(`Nombre Real`, `N/A`, true );
    } else {
      steamUserEmbed.addField(`Nombre Real`, steamUserData.realname, true );
    }*/
    steamUserEmbed.addField(`Nivel`, steamUserData.level, true );
    switch (steamUserData.status) {
      case 0:
      steamUserEmbed.addField("Estado", "Desconectado", true );
      steamUserEmbed.setColor(0x747F8D);
      break;
      case 1:
      steamUserEmbed.addField("Estado", "Conectado", true );
      steamUserEmbed.setColor(0x2C82EC);
      break;
      case 2:
      steamUserEmbed.addField("Estado", "Ocupado", true );
      steamUserEmbed.setColor(0xF04747);
      break;
      case 3:
      steamUserEmbed.addField("Estado", "Ausente", true );
      steamUserEmbed.setColor(0xFAA61A);
      break;
      case 4:
      steamUserEmbed.addField("Estado", "Durmiendo", true );
      steamUserEmbed.setColor(0xFAA61A);
      break;
      case 5:
      steamUserEmbed.addField("Estado", "Deseando intercambiar", true );
      steamUserEmbed.setColor(0x2C82EC);
      break;
      case 6:
      steamUserEmbed.addField("Estado", "Deseando jugar", true );
      steamUserEmbed.setColor(0x2C82EC);
      break;
    }
    if(steamUserData.loccountrycode !== undefined){
      var loccountryname = steamCountries[steamUserData.loccountrycode].name;
      steamUserEmbed.addField("País", loccountryname, true );
    }
    if(steamUserData.loccityid !== undefined){
      var loccountrycode = steamUserData.loccountrycode;
      var locstatecode = steamUserData.locstatecode;
      var loccityid = steamUserData.loccityid;
      var loccityname = steamCountries[loccountrycode].states[locstatecode].cities[loccityid].name;
      steamUserEmbed.addField("Ciudad", `${loccityname}`, true );
    }
    steamUserEmbed.addField("Cuenta creada", moment(new Date(steamUserData.timecreated*1000)).format('DD/MM/YYYY'), true );
    steamUserEmbed.addField("Última conexión", moment(new Date(steamUserData.lastlogoff*1000)).format('DD/MM/YYYY, h:mm a'), true );
    if(steamUserData.gameinfo !== undefined){
      steamUserEmbed.addField("Jugando a", steamUserData.gameinfo);
      steamUserEmbed.setColor(0x43B581);
    }
    steamUserEmbed.setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    message.channel.send({embed: steamUserEmbed});
  }
  function requestURL(urls, callback) {
    'use strict';
    var results = {}, t = urls.length, c = 0,
      handler = function (error, response, body) {
        var url = response.request.uri.href;
        results[url] = { error: error, response: response, body: body };
        if (++c === urls.length) { callback(results); }
      };
    while (t--) { request(urls[t], handler); }
  }
}

exports.info = {
  name: "steam",
  alias: ["steaminfo", "steaminf"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra tu cuenta de steam o de otro miembro.",
  usage: "steam [usuario]"
};
