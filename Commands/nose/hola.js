const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	category: 'dev',
	data: new SlashCommandBuilder()
		.setName("hola")
		.setDescription("Te respondere xd as"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		const button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId(`hola`)
				.setLabel(`nada xd`)
				.setStyle(ButtonStyle.Success)
		);

		interaction.reply({ components: [button] });
	},
};