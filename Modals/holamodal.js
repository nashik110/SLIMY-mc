const {
	PermissionsBitField,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
	data: {
		name: `holamodalhandled`,
	},

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client, lang) {

        const mamada_ingresada = interaction.fields.getTextInputValue("holamodaltextinput");
        interaction.reply(mamada_ingresada)
	},
};
