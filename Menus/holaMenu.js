const {
	PermissionsBitField,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
	data: {
		name: `holamenu`,
	},

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client, args, lang) {
		const valor = interaction.values[0];

		switch (valor) {
			case "Principal":
				const embed = new EmbedBuilder()
					.setColor("#0099ff")
					.setTitle(`${valor}`)
					.setDescription("<a:orangealert:1087160827230040104> Hey crack bienvenido a **Principal**");

				await interaction.update({ embeds: [embed] });
				break;

			case "Administracion":
				const embed1 = new EmbedBuilder()
					.setColor("#0099ff")
					.setTitle(`${valor}`)
					.setDescription("<a:orangealert:1087160827230040104> Hey crack bienvenido a **Aministracion**");

				await interaction.update({ embeds: [embed1] });
				break;
		}
	},
};
