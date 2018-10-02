// =================================================
// DIAMOND - Discord Bot
// Created by LOSDEV (www.losdev.es)
// Email: losdevpath@gmail.com
// =================================================
// Módulos
const Discord = require("discord.js");
const mysql = require("mysql");
const fs = require("fs");
// Archivos
const config = require("./config.json");
const botinfo = require("./version.json");
const errors = require("./bot_utils/errores.js");
const automensajes = require("../bot_data/automensajes.json");
// Definir bot y comandos
const bot = new Discord.Client({ autoReconnect: true });
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// ===========================================
// MYSQL - Conexión a base de datos
// ===========================================
var con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "pass",
  database: "database",
});
con.connect(err => {
  console.log(`---------------------------------`);
  console.log(` > Cargando base de datos...     `);
  console.log(`---------------------------------`);
  if(err) throw err;
  console.log("(!) Base de datos conectada!");
  console.log(`---------------------------------`);
  console.log(` `);
});

// ===========================================
// COMANDOS - Cargar comandos
// ===========================================
fs.readdir("./bot_cmds/", (err, files) => {
  if(err) console.log(err);
  console.log(`---------------------------------`);
  console.log(`                                 `);
  console.log("           - DIAMOND -           ");
  console.log("          - by LOSDEV -          ");
  console.log(`                                 `);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  console.log(`---------------------------------`);
  console.log(` > Cargando comandos...          `);
  console.log(`---------------------------------`);
  if(jsfile.length <= 0){
    console.log("(!) No se han encontrado comandos!");
    return;
  }
  jsfile.forEach((f, i) =>{
    let props = require(`./bot_cmds/${f}`);
    console.log(`${i + 1}: ${f} cargado!`);
    bot.commands.set(props.info.name, props);
  });
  console.log(`---------------------------------`);
  console.log(`(!) Se han cargado ${jsfile.length} comandos.`);
  console.log(`---------------------------------`);
  console.log(` `);
});

// ===========================================
// READY - Acciones cuando el bot se conecta
// ===========================================
bot.on("ready", () => {
  console.log(`---------------------------------`);
  console.log(`(!) ${bot.user.username} está online!`);
  console.log(`---------------------------------`);
  bot.user.setActivity(config.actividad, {type: config.tipo_actividad});
});

// ===========================================
// EXPGEN - Generador de experiencia
// ===========================================
function generateXp() {
  return Math.floor(Math.random() * 7) + 8;
}

// ===========================================
// LEVEL_SYS - Sistema de nivel y experiencia
// ===========================================
bot.on("message", message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  // Comprobar si el sistema está activo
  let nivelActivo = config.nivel_activo;
  if(nivelActivo === "false") { return message.channel.send(`**ERROR:** El sistema de niveles está desactivado.`); }
  // Sistema de nivel y experiencia
  con.query(`SELECT * FROM usuarios WHERE id='${message.author.id}' and servidor='${message.guild.id}'`, (err, rows) => {
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${message.author.id}', '${generateXp()}', '1', '${message.guild.id}')`;
    } else {
      let currentExp = rows[0].exp;
      let currentLvl = rows[0].nivel;
      let money = rows[0].dinero;
      let newLvl = currentLvl * 300;
      let addExp = generateXp();
      let newExpDB = currentExp + addExp;
      if(newLvl <= currentExp) {
        let newLvlDB = currentLvl + 1;
        let addMoney = newLvlDB * 15;
        let newMoney = money + addMoney;
        let levelUp = new Discord.RichEmbed()
        .setTitle(`:arrow_up: ${message.author.username} ha subido de nivel!`)
        .setThumbnail(message.author.displayAvatarURL)
        .setColor("#94ec25")
        .setDescription(`**¡¡Enhorabuena!!** 🎉 Has subido al **Nivel ${newLvlDB}**!!.\nSigue participando para desbloquear nuevas funciones!!\nHas ganado **${addMoney} ${config.moneda_plural}** por subir de nivel.`)
        .setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
        let activityChannel = message.guild.channels.find(`name`, config.canal_actividad);
        activityChannel.send(levelUp).then(function (message){
          message.react("🍺")
          message.react("👍")
          message.react("🎉")
        });
        sql = `UPDATE usuarios SET exp=${newExpDB}, nivel=${newLvlDB}, dinero=${newMoney} WHERE id='${message.author.id}' and servidor='${message.guild.id}'`;
      } else {
        sql = `UPDATE usuarios SET exp=${newExpDB} WHERE id='${message.author.id}' and servidor='${message.guild.id}'`;
      }
    }
    con.query(sql);
  });
});

// ===========================================
// SPAM - Sistema anti-spam
// ===========================================
bot.on("message", message => {
  // Eliminar invitaciones a otros servidores
  if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)) {
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      message.delete();
      return;
    }
  }
});

// ===========================================
// COMANDOS - Sistema de comandos
// ===========================================
bot.on("message", message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  var u = message.author.username;
  var c = message.channel.name;
  var m = message.content;
  console.log("[" + message.guild.name + "] [" + c + "] " + u + ": " + m);
  if(!m.startsWith(config.prefijo)) return;
  var args = m.substring(config.prefijo.length).split(" ");
  var cmdName = args[0].toLowerCase();
  bot.commands.forEach(command => {
    if(cmdName === command.info.name || command.info.alias.includes(cmdName)) {
      if(command.info.guildOnly && message.channel.guild == undefined) return message.channel.send(":poop: Ese comando no se puede escribir en privado.");
      if(command.info.permission == "admin" && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":poop: Ese comando es de admin! :^)");
      if(command.info.permission == "staff" && !message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":poop: Ese comando es de staff! :^)");
      command.execute(bot, message, args, con);
    }
  });
});

// ===========================================
// WELCOME - Sistema de bienvenida al servidor
// ===========================================
bot.on('guildMemberAdd', member => {
  // Comprobar si el sistema está activo
  let bienvanidaActivo = config.bienvenida_activo;
  if(bienvanidaActivo === "false") return;
  // Comprobar si el canal existe
  let welcomeChannel = member.guild.channels.find("name", config.canal_bienvenida);
  if (!welcomeChannel) return;
  // Sistema de bienvenida
  let embedData = new Discord.RichEmbed()
  .setAuthor(`Un nuevo miembro se ha conectado!`)
  .setThumbnail(member.user.avatarURL)
  .setColor('#afe232')
  .setDescription(`Hola **${member.user.username}**!\nBienvenido/a a **${member.guild.name}**!\nLee las **normas**, y disfruta de la comunidad!`)
  .setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
  welcomeChannel.send(embedData).then(function (message){
    message.react("🍺")
    message.react("👍")
    message.react("🎉")
  });
  con.query(`SELECT * FROM usuarios WHERE id='${member.user.id}' and servidor='${member.guild.id}'`, (err, rows) =>{
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO usuarios (id, exp, nivel, servidor) VALUES ('${member.user.id}', '0', '1', '${member.guild.id}')`;
      con.query(sql);
    }
  });
});

// ===========================================
// BYE - Sistema de despedida del servidor
// ===========================================
bot.on('guildMemberRemove', member => {
  // Comprobar si el sistema está activo
  let bienvanidaActivo = config.bienvenida_activo;
  if(bienvanidaActivo === "false") return;
  // Comprobar si el canal existe
  let welcomeChannel = member.guild.channels.find("name", config.canal_bienvenida);
  if (!welcomeChannel) return;
  // Sistema de despedida
  let embedData = new Discord.RichEmbed()
  .setAuthor(`Un miembro se ha desconectado`)
  .setThumbnail(member.user.avatarURL)
  .setColor('#d13e3e')
  .setDescription(`**${member.user.username}** ha abandonado el servidor! 💔`)
  .setFooter(`${botinfo.nombre} v${botinfo.version}, Creado por ${botinfo.autor}`, botinfo.imagen);
  welcomeChannel.send(embedData).then(function(message) {
    message.react("💩")
    message.react("💔")
  });
});

// ===========================================
// AUTO-RANGO - Asignación de rango al entrar
// ===========================================
bot.on('guildMemberAdd', member => {
  // Comprobar si el sistema está activo
  let autorangoActivo = config.autorango_activo;
  if(autorangoActivo === "false") return;
  // Sistema de autorango
  let rango = member.guild.roles.find(`name`, config.autorango_rango);
  setTimeout(function(){
    member.addRole(rango.id);
  }, 4000);
});

// Logear el bot
bot.login(config.discord_token);
