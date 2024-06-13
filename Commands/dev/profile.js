const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    category: "functions",
    data: new SlashCommandBuilder()
      .setName("info-user")
      .setDescription("Te muestra las estadísticas de un usuario.")
      .addUserOption((option) =>
        option
          .setName(`usuario`)
          .setDescription(`Elige al usuario para ver sus estadísticas.`),
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const user = interaction.options.getUser(`usuario`) || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
      const banner = await (
        await client.users.fetch(user.id, { force: true })
      ).bannerURL({ size: 4096 });
      const embed = new EmbedBuilder()
        .setTitle(`${user.globalName || user.username}`)
        .setColor("Random")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setImage(user.bannerURL({ size: 512 }))
        .setTimestamp()
        .setFooter({
          text: `Solicitado por: ${interaction.user.tag}`,
          iconURL:
            interaction.user.displayAvatarURL({ dynamic: true }) ||
            "https://cdn.discordapp.com/attachments/1053464482095050803/1053464952607875072/PRywUXcqg0v5DD6s7C3LyQ.png",
        })
        .addFields(
          {
            name: "Información del Usuario:",
            value: [
              `**Usuario**: ${user.username}`,
              `**Nombre**: ${user.globalName}`,
              `**ID**: (${user.id})`,
              `**Color**: ${user.hexAccentColor || "Ninguno"}`,
              `**Boost**: ${member.premiumSince ? `Si` : `No`}`,
              `**Insignia**: ${user.flags.toArray().join(", ") || "Ninguna"}`,
              `**Bot**: ${user.bot ? `Si` : `No`}`,
              `**Status**: ${user.presence?.status || "Desconectado"}`,
            ].join("\n"),
          },
          {
            name: "Membresía en Discord",
            value: [
              `<t:${parseInt(user.createdTimestamp / 1000)}:F> (<t:${parseInt(user.createdTimestamp / 1000)}:R>)`,
            ].join("\n"),
          },
          {
            name: `Membresía en ${interaction.guild.name}`,
            value: [
              `<t:${parseInt(user.createdTimestamp / 1000)}:F> (<t:${parseInt(member.joinedAt / 1000)}:R>)`,
            ].join("\n"),
          },
          {
            name: `Roles (${member.roles.cache.size})`,
            value: [
              `\n${member.roles.cache.map((role) => role.toString()).join(", ")}`,
            ].join("\n"),
          },
          {
            name: "Banner",
            value: user.bannerURL() ? "** **" : "El usuario no tiene banner.",
          },
        );
      await interaction.reply({
        embeds: [embed],
      });
    },
  };