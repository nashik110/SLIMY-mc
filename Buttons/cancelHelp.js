const { PermissionsBitField, ButtonInteraction } = require("discord.js");

module.exports = {
	data: {
		name: `cancelHelp`,
	},

	/**
	 * @param {ButtonInteraction} interaction
	 */

	async execute(interaction, client, args) {

		const userIdT = args[0];
		const userId = interaction.user.id;
		const initialMessageId = interaction.message.interaction?.user?.id || interaction.message.mentions.users.first()?.id || userIdT;

		if (userId === initialMessageId || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.message.delete().catch((e) => {
				return interaction.deleteReply().catch((e)=>{});
			});
		} else {
			interaction.reply({ content: `No es tu interacción o no tienes los permisos para hacer esto.`, ephemeral: true }).catch((e) => {});
		}
	},
};
