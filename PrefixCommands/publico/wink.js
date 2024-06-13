const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  category: 'functions',
  name: "wink",

  /**
   * @param {Message} message
   */
  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    let description;
    if (target) {
      description = `**${user}** guiñó un ojo a **${target.username}**! 😉`;
    } else {
      description = `**${user}** guiñó un ojo! 😉`;
    }

    const url = await anime.wink();

    const embed = new EmbedBuilder()
      .setTitle("Comando de Guiño 😉")
      .setDescription(description)
      .setColor("Yellow") // Puedes cambiar el color a tu preferencia
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
