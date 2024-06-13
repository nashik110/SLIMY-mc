const { PermissionsBitField, EmbedBuilder } = require("discord.js");


module.exports = {
    data: {
        name: `hola`,
    },
    async execute(interaction, client, args, lang) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Error")
            .setDescription("<a:orangealert:1087160827230040104> a donde vas crack")
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.reply({content: client.languages.__({ phrase: 'buttonHola.saluda', locale: lang})});

    },
};