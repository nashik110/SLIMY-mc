const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  category: 'functions',
  name: "cry",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Verificar si se menciona al bot
    if (target && target.id === message.client.user.id) {
      return message.channel.send("¡No me hagas llorar! 😢");
    }

    // Si se menciona a otro usuario, mostrar que lloran juntos
    if (target && target.id !== message.author.id) {
      const targetUser = target.toString();
      const url = await anime.cry();

      const embed = new EmbedBuilder()
        .setDescription(`**${user}** y **${targetUser}** están llorando juntos 😢`)
        .setColor("Blue") // Puedes ajustar el color según tus preferencias
        .setImage(url);

      return message.channel.send({ embeds: [embed] });
    }

    // Si no se menciona a otro usuario, mostrar que lloran solos
    const url = await anime.cry();

    const embed = new EmbedBuilder()
      .setDescription(`**${user}** está llorando solo 😢`)
      .setColor("Blue") // Puedes ajustar el color según tus preferencias
      .setImage(url);

    // Enviar el mensaje embed al canal
    await message.channel.send({ embeds: [embed] });
  },
};
