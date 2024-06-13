const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    execute : "",
    category: 'member',
    data: new SlashCommandBuilder()
        .setName('pg')
        .setDescription('purge messages.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('amount Of messages to delete.')
                .setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
            .setColor("Black")
            .setTitle("Error")
            .setDescription("❌ No perms")
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const cantidad = interaction.options.getInteger('amount');

        if (cantidad < 0 || cantidad > 999) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ | Only numbers 0-999.')
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const messages = await interaction.channel.bulkDelete(cantidad, true);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`✅ | se han eliminado con exito!! ${messages.size} `);

        if (messages.size < cantidad) {
            embed.setDescription('✅ | se han eliminado con exito!.');
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};