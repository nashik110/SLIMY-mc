const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  category: 'functions',
  name: "bang",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Check if the bot is mentioned
    if (target && target.id === message.client.user.id) {
      return message.channel.send("¡No me dispares! 😱");
    }

    // Check if the command issuer is trying to shoot oneself
    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No te dispares a ti mismo! 😰");
    }

    const url = await anime.shoot(); // Cambiado a "shoot" en lugar de "kill"

    const embed = new EmbedBuilder()
      .setDescription(`**${user}** disparó a **${target.username}** 💥`) // Cambiado a "disparó" en lugar de "mató"
      .setColor("DarkButNotBlack")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
