const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
	category: 'dev',
    developer: true,
	data: new SlashCommandBuilder()
		.setDMPermission(false)
		.setName("holamenu")
		.setDescription("Te respondere xd as"),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

        const holafistmenu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
			.setCustomId("holamenu")
			.addOptions([
				{
					label: "Menu Principal",
					description: "Categorias",
					value: "Principal",
				},
				{
					label: "Administracion",
					description: "Comandos de barra",
					value: "Administracion",
				},
            ])
        )

		interaction.reply({ content: `Selecciona algo perra`, components: [holafistmenu] });
	},
};
