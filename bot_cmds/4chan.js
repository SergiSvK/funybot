// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const https = require('https');
// Archivos
const config = require("../config.json");
const botinfo = require("../version.json");

exports.execute = (bot, message, args) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.fchan_activo;
  if(cmdActivo === "false") { return message.channel.send(`**ERROR:** El comando está desactivado.`); }
  // Comprobar si se requiere escribir en un canal
  let requireChannel = config.requerir_canales;
  if(requireChannel === "true") {
    // Comprobar si se está escribiendo en el canal específico
    let cmdChannel = config.canal_comandos;
    if(cmdChannel !== message.channel.name) return message.channel.send(`:poop: Escribe el comando en el canal **#${config.canal_comandos}**!`);
  }

  const boards = [
    "a", "b", "c", "d", "e", "f", "g", "gif", "h", "hr", "k", "m", "o", "p", "r", "s", "t", "u", "v", "vg", "vr", "w", "wg", "i", "ic", "r9k", "s4s", "vip", "qa", "cm", "hm", "lgbt", "y", "3", "aco", "adv", "an", "asp", "bant", "biz", "cgl", "ck", "co", "diy", "fa", "fit", "gd", "hc", "his", "int", "jp", "lit", "mlp", "mu", "n", "news", "out", "po", "pol", "qst", "sci", "soc", "sp", "tg", "toy", "trv", "tv", "vp", "wsg", "wsr"
  ];

  if(args.length < 2) return message.channel.send(`:poop: No has espeficicado un foro. Escribe **${config.prefijo}4chan lista** para ver los foros.`);

  if(args.length == 2){
    if(args[1] === "lista" || args[1] === "list") {
      var msg = "";
      for(var i = 0; i < boards.length; i++) {
        msg += boards[i] + ", ";
      }
      msg = msg.substring(0, msg.length - 2);
      let embed = new Discord.RichEmbed()
      .setAuthor(`Lista de foros de 4chan.org`, `https://i.imgur.com/cygTvKG.png`)
      .setColor("#388b25")
      .setDescription(`${msg}`)
      .setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
      return message.channel.send(embed);
    }
  }

  var board = args[1];
  if(boards.indexOf(board) == -1){
    message.channel.send(`:poop: Ese foro no es válido! ${config.prefijo}4chan lista`);
    return;
  }

  var page = Math.floor((Math.random() * 10) + 1);
  var url = "https://a.4cdn.org/" + board + "/" + page + ".json"
  console.log(url);

  https.get(url, res => {
    res.setEncoding('utf8');
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", end => {
      body = JSON.parse(body);
      var postNr = Math.floor(Math.random() * body.threads.length);
      var imgId = body.threads[postNr].posts[0].tim;
      var imgExt = body.threads[postNr].posts[0].ext;
      var com = body.threads[postNr].posts[0].com;

      if(com == null){
        com = "";
      }else{
        com = com.replace(/<br>/g, "\n");
        com = com.replace(/<span class=\"quote\">&gt;/g, ">");
        com = com.replace(/<\/span>/g, "");
        com = com.replace(/&quot/g, '"');
        com = com.replace(/&#039;/g, "'");
        com = com.substring(0, 255);
      }

      var thread = "http://boards.4chan.org/"+ board +"/thread/";
      thread += body.threads[postNr].posts[0].no;
      var imgUrl = "http://i.4cdn.org/" + board + "/";
      imgUrl += imgId + "" + imgExt;

      let embed = new Discord.RichEmbed()
      .setAuthor(`Imagen random de /${board}/ - 4chan.org`, `https://i.imgur.com/cygTvKG.png`)
      .setTitle(`${com}`)
      .setURL(`${thread}`)
      .setColor("#388b25")
      .setImage(`${imgUrl}`)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      message.channel.send(embed);
    });
  });

}

exports.info = {
  name: "4chan",
  alias: ["4c"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Muestra una imagen de un foro de 4chan.",
  usage: "4chan [foro]"
};
