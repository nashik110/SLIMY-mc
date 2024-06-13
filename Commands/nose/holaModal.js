const { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
	category: 'dev',
    developer: true,
	data: new SlashCommandBuilder()
		.setDMPermission(false)
		.setName("holamodal")
		.setDescription("muestra un modal"),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		const modal = new ModalBuilder()
			.setCustomId("holamodalhandled")
			.setTitle("Edita el autor y el footer del embed");


        const bn = new TextInputBuilder()
			.setCustomId("holamodaltextinput")
			.setLabel("este es el label")
			.setValue(`Este es el value`)
			.setRequired(true)
			.setPlaceholder('Este es el placeholder')
			.setStyle(TextInputStyle.Short)
	
		const modalWhithTextInput = new ActionRowBuilder().addComponents(bn)
		modal.addComponents(modalWhithTextInput);

		await interaction.showModal(modal);
	},
};
