const {
	PermissionsBitField,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const spamDetection = require("../Schemas/spamDetection");

module.exports = {
	data: {
		name: `deleteRule`,
	},
	async execute(interaction, client, args) {
		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
		) {
			return await interaction.reply({
				content: ":x: No tienes permisos para usar este boton.",
				ephemeral: true,
			});
		}
		const emojiId = `<:xb:1112140703670214786>`;
		const url = `https://discord.com/oauth2/authorize?client_id=1221995267390181427&permissions=8&scope=bot`;

		const btnAyuda = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel(`Soporte`)
				.setStyle(ButtonStyle.Link)
				.setURL(`https://discord.gg/N3yP36Cq7s`),

			new ButtonBuilder()
				.setLabel(`Invitarme`)
				.setStyle(ButtonStyle.Link)
				.setURL(url),

			new ButtonBuilder()
				.setLabel("Mas informacion")
				.setStyle(ButtonStyle.Link)
				.setURL("https://www.instagram.com/fannyy_lpz?igsh=d3Zsczd0aml5OHoy&utm_source=qr")
		);

        const guildId = interaction.guild.id;
        const ruleId = args[0];

		try {
			// Obtener los detalles de la regla
			const ruleResponse = await axios.get(
				`https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
				{
					headers: {
						Authorization: `Bot ${interaction.client.token}`,
					},
				}
			);

			const ruleName = ruleResponse.data.name;

			if (await ruleName.startsWith("Anti Spam by:")) {
				await spamDetection.findOneAndDelete({
					guildId: interaction.guild.id,
				});
			}

			// Eliminar la regla
			const response = await axios.delete(
				`https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
				{
					headers: {
						Authorization: `Bot ${interaction.client.token}`,
					},
				}
			);

			if (response.status === 204) {
				const embed = new EmbedBuilder()
					.setTitle("Regla eliminada")
					.setDescription(
						`Se eliminó la regla de AutoMod "**${ruleName}**" con ID: **${ruleId}**`
					)
					.setColor("#00ff00");

				await interaction.update({ embeds: [embed], components: [btnAyuda] });
			} else {
				const embed = new EmbedBuilder()
					.setTitle("❌ | Error")
					.setDescription("Ocurrió un error al eliminar la regla de AutoMod")
					.setColor("#ff0000");

				await interaction.update({ embeds: [embed], components: [btnAyuda] });
			}
		} catch (error) {
			const embed = new EmbedBuilder()
				.setTitle("❌ | Error")
				.setDescription(
					`Ocurrió un error con la regla de AutoMod seleccionada.\n\nEs posible que esta regla no pueda ser eliminada pues algunos servidores con el ajuste de comunidad activo tienen esta regla predeterminada.\n${error}`
				)
				.setColor("#ff0000")
				.setFooter({
					text: `${client.user.tag} || ${client.ws.ping}Ms`,
					iconURL: client.user.displayAvatarURL(),
				});
			await interaction.update({ embeds: [embed], components: [btnAyuda] });
		}
	},
};
