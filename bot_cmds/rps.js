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
// Cooldown
const cdPiedra = new Set();

exports.execute = (bot, message, args, con) => {
  // Comprobar si el comando está activo
  let cmdActivo = config.piedra_activo;
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

  if(args.length < 2) return message.channel.send(`:poop: Debes escribir una opción! Ej: ${config.prefijo}rps (piedra/papel/tijera/lagarto/spock)`);
  if(cdPiedra.has(message.author.id)) return message.channel.send(`<:rock:${config.emoji_rock}> Debes esperar 10 segundos para volver a jugar!`);

  if(args[1] === "help" || args[1] === "ayuda") {
    let ayuda = new Discord.RichEmbed();
    ayuda.setAuthor(`¿Cómo se juega? - Piedra, Papel, Tijera, Lagarto, Spock`, `https://i.imgur.com/JqSi1HR.png`);
    ayuda.setDescription(`Las tijeras cortan el papel, el papel envuelve la piedra, la piedra aplasta al lagarto, el lagarto envenena a Spock, Spock destruye las tijeras, las tijeras decapitan al lagarto, el lagarto se come el papel, el papel desacredita a Spock, Spock desintegra la piedra y la piedra aplasta las tijeras.`);
    ayuda.setImage(`https://i.imgur.com/u3FAan2.jpg`)
    .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
    return message.channel.send(ayuda);
  }

  // Elección del usuario
  var usuarioGame = `${args[1]}`;

  var options = ["piedra", "papel", "tijera", "lagarto", "spock"];
  if(options.indexOf(usuarioGame) < 0) return message.channel.send(`:poop: Debes escribir una opción! Ej: ${config.prefijo}rps (piedra/papel/tijera/lagarto/spock)`);

  // Elección del bot
  let botGame = Math.floor(Math.random() * 5);
  if(botGame === 0) {
    botGame = "piedra";
  }
  if(botGame === 1) {
    botGame = "papel";
  }
  if(botGame === 2) {
    botGame = "tijera";
  }
  if(botGame === 3) {
    botGame = "lagarto";
  }
  if(botGame === 4) {
    botGame = "spock";
  }

  // Comienza el juego...
  var resultado;
  var razon;
  if(`${usuarioGame}` === `${botGame}`) {
    resultado = "empate";
    razon = "igual";
  }

  // PIEDRA
  if(usuarioGame === "piedra") {
    usuarioGame = `<:rock:${config.emoji_rock}>`;
    if(botGame === `tijera`) {
      botGame = `✂️`;
      resultado = `gana`;
      razon = `<:rock:${config.emoji_rock}> rompe la ✂️`;
    }
    if(botGame === `lagarto`) {
      botGame = `🦎`;
      resultado = `gana`;
      razon = `<:rock:${config.emoji_rock}> aplasta a 🦎`;
    }
    if(botGame === `piedra`) {
      botGame = `<:rock:${config.emoji_rock}>`;
      resultado = `empate`;
      razon = `<:rock:${config.emoji_rock}> es igual que <:rock:${config.emoji_rock}>`;
    }
    if(botGame === `papel`) {
      botGame = `📄`;
      resultado = `pierde`;
      razon = `📄 envuelve a <:rock:${config.emoji_rock}>`;
    }
    if(botGame === `spock`) {
      botGame = `🖖`;
      resultado = `pierde`;
      razon = `🖖 pulveriza la <:rock:${config.emoji_rock}>`;
    }
  }
  // PAPEL
  if(usuarioGame === `papel`) {
    usuarioGame = `📄`;
    if(botGame === `piedra`) {
      botGame = `<:rock:${config.emoji_rock}>`;
      resultado = `gana`;
      razon = `📄 envuelve a <:rock:${config.emoji_rock}>`;
    }
    if(botGame === `spock`) {
      botGame = `🖖`;
      resultado = `gana`;
      razon = `📄 desautoriza a 🖖`;
    }
    if(botGame === `papel`) {
      botGame = `📄`;
      resultado = `empate`;
      razon = `📄 es igual que 📄`;
    }
    if(botGame === `tijera`) {
      botGame = `✂️`;
      resultado = `pierde`;
      razon = `✂️ corta el 📄`;
    }
    if(botGame === `lagarto`) {
      botGame = `🦎`;
      resultado = `pierde`;
      razon = `🦎 se come el 📄`;
    }
  }
  // TIJERA
  if(usuarioGame === `tijera`) {
    usuarioGame = `✂️`;
    if(botGame === `papel`) {
      botGame = `📄`;
      resultado = `gana`;
      razon = `✂️ corta el 📄`;
    }
    if(botGame === `lagarto`) {
      botGame = `🦎`;
      resultado = `gana`;
      razon = `✂️ decapita a 🦎`;
    }
    if(botGame === `tijera`) {
      botGame = `✂️`;
      resultado = `empate`;
      razon = `✂️ es igual que ✂️`;
    }
    if(botGame === `spock`) {
      botGame = `🖖`;
      resultado = `pierde`;
      razon = `🖖 rompe la ✂️`;
    }
    if(botGame === `piedra`) {
      botGame = `<:rock:${config.emoji_rock}>`;
      resultado = `pierde`;
      razon = `<:rock:${config.emoji_rock}> rompe las ✂️`;
    }
  }
  // LAGARTO
  if(usuarioGame === `lagarto`) {
    usuarioGame = `🦎`;
    if(botGame === `papel`) {
      botGame = `📄`;
      resultado = `gana`;
      razon = `🦎 se come el 📄`;
    }
    if(botGame === `spock`) {
      botGame = `🖖`;
      resultado = `gana`;
      razon = `🦎 envenena a 🖖`;
    }
    if(botGame === `lagarto`) {
      botGame = `🦎`;
      resultado = `empate`;
      razon = `🦎 es igual que 🦎`;
    }
    if(botGame === `tijera`) {
      botGame = `✂️`;
      resultado = `pierde`;
      razon = `✂️ decapita a 🦎`;
    }
    if(botGame === `piedra`) {
      botGame = `<:rock:${config.emoji_rock}>`;
      resultado = `pierde`;
      razon = `<:rock:${config.emoji_rock}> aplasta a 🦎`;
    }
  }
  if(usuarioGame === `spock`) {
    usuarioGame = `🖖`;
    if(botGame === `piedra`) {
      botGame = `<:rock:${config.emoji_rock}>`;
      resultado = `gana`;
      razon = `🖖 vaporiza la <:rock:${config.emoji_rock}>`;
    } else
    if(botGame === `tijera`) {
      botGame = `✂️`;
      resultado = `gana`;
      razon = `🖖 rompe la ✂️`;
    }
    if(botGame === `spock`) {
      botGame = `🖖`;
      resultado = `empate`;
      razon = `🖖 es igual que 🖖`;
    }
    if(botGame === `papel`) {
      botGame = `📄`;
      resultado = `pierde`;
      razon = `📄 desautoriza a 🖖`;
    }
    if(botGame === `lagarto`) {
      botGame = `🦎`;
      resultado = `pierde`;
      razon = `🦎 envenena a 🖖`;
    }
  }
  // Resultado del juego
  let juego = new Discord.RichEmbed();
  juego.setAuthor(`Piedra, Papel, Tijera, Lagarto, Spock`, `https://i.imgur.com/JqSi1HR.png`);
  if(resultado === "gana") {
    juego.setDescription(`**${message.author.username}** ha sacado ${usuarioGame}\n**${config.nombre}** ha sacado ${botGame}`);
    juego.addField(`¡¡HAS GANADO!!`,`${razon}`);
    juego.setColor("#96d645");
  }
  if(resultado === "pierde") {
    juego.setDescription(`**${message.author.username}** ha sacado ${usuarioGame}\n**${config.nombre}** ha sacado ${botGame}`);
    juego.addField(`HAS PERDIDO...`,`${razon}`);
    juego.setColor("#d64545");
  }
  if(resultado === "empate") {
    juego.setDescription(`**${message.author.username}** ha sacado ${usuarioGame}\n**${config.nombre}** ha sacado ${botGame}`);
    juego.addField(`HAS EMPATADO`,`${razon}`);
    juego.setColor("#707070");
  }
    juego.setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
  message.channel.send(juego);
  cdPiedra.add(message.author.id);
  setTimeout(() => { cdPiedra.delete(message.author.id); }, 10000);
}

exports.info = {
  name: "rps",
  alias: ["pptls"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Piedra, papel, tijera, lagarto, spock.",
  usage: "rps (piedra/papel/tijera/lagarto/spock)"
};
