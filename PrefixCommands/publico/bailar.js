const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

// Create a Map to store dance counts
const danceCounts = new Map();

module.exports = {
  category: 'functions',
  name: "dance",

  /**
   * @param {Message} message
   */
  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Initialize dance count for the command issuer
    if (!danceCounts.has(user)) {
      danceCounts.set(user, 0);
    }

    // Increment dance count for the command issuer
    danceCounts.set(user, danceCounts.get(user) + 1);

    let description;
    if (target) {
      description = `**${user}** comenzó a bailar con **${target.username}** por ${danceCounts.get(user)} vez(es)! 🕺💃`;
    } else {
      description = `**${user}** comenzó a bailar solo por ${danceCounts.get(user)} vez(es)! 🕺`;
    }

    const url = await anime.dance();

    const embed = new EmbedBuilder()
      .setTitle("Comando de Baile")
      .setDescription(description)
      .setColor("DarkButNotBlack")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
