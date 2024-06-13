
const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  category: 'functions',
  name: "kill",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Check if the bot is mentioned
    if (target && target.id === message.client.user.id) {
      return message.channel.send("¡No me mates! 😱");
    }

    // Check if the command issuer is trying to kill oneself
    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No te suicides! 😰");
    }

    const url = await anime.kill();

    const embed = new EmbedBuilder()
      .setDescription(`**${user}** mató a **${target.username}** 💀`)
      .setColor("DarkButNotBlack")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
