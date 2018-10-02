const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

module.exports.noPerms = (message) => {
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setTitle("PERMISOS INSUFICIENTES!")
    .setColor('#ff0000')
    .setDescription(":poop: No tienes suficientes permisos para ejecutar ese comando.");
    message.channel.send(embed).then(m => m.delete(5000));
}

module.exports.equalPerms = (message, user, perms) => {
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor('#ff0000')
    .setTitle("ERROR #001")
    .addField(`:poop: ${user} tiene el permiso`, perms);
    message.channel.send(embed).then(m => m.delete(5000));
}

module.exports.botuser = (message) => {
    let embed = new Discord.RichEmbed()
    .setTitle("ERROR #002")
    .setDescription(":poop: No puedes banearme, humano! Muahahaha!")
    .setColor('#ff0000');
    message.channel.send(embed).then(m => m.delete(5000));
}

module.exports.cantfindUser = (channel) => {
    let embed = new Discord.RichEmbed()
    .setTitle("ERROR #003")
    .setDescription(":poop: No puedo encontrar a ese usuario.")
    .setColor('#ff0000');
    channel.send(embed).then(m => m.delete(5000));
}

module.exports.noReason = (channel) => {
    let embed = new Discord.RichEmbed()
    .setTitle("ERROR #004")
    .setDescription(":poop: Por favor, escribe una razón!")
    .setColor('#ff0000');
    channel.send(embed).then(m => m.delete(5000));
}
