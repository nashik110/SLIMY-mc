const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  category: 'functions',
  name: "slap",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Check if the bot is mentioned
    if (target && target.id === message.client.user.id) {
      return message.channel.send("¡No me golpees! 😱");
    }

    // Check if the command issuer is trying to slap oneself
    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No te golpees a ti mismo! 😰");
    }

    const url = await anime.slap();

    const embed = new EmbedBuilder()
      .setDescription(`**${user}** golpeó a **${target.username}** 👋`)
      .setColor("DarkButNotBlack")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
