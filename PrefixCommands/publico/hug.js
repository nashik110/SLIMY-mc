const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

// Crear un objeto para almacenar el contador
const hugCounter = {};

module.exports = {
  category: 'functions',
  name: "hug",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Incrementar el contador para el usuario que envía el comando
    hugCounter[user] = (hugCounter[user] || 0) + 1;

    // Verificar si se menciona al bot
    if (target && target.id === message.client.user.id) {
      return message.channel.send("¡No me abraces! 😳");
    }

    // Verificar si el emisor del comando intenta abrazarse a sí mismo
    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No puedes abrazarte a ti mismo! 😅");
    }

    // Obtener la URL de la animación de abrazo
    const url = await anime.hug();

    // Construir el mensaje embed con la animación de abrazo y el contador
    const embed = new EmbedBuilder()
      .setDescription(`**${user}** abrazó a **${target.username}** 🤗\n¡Has abrazado a alguien ${hugCounter[user]} veces!`)
      .setColor("Purple") // Puedes ajustar el color según tus preferencias
      .setImage(url);

    // Enviar el mensaje embed al canal
    await message.channel.send({ embeds: [embed] });
  },
};
