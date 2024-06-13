const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
} = require("discord.js");

module.exports = {
    category: 'dev',
    data: new SlashCommandBuilder()
        .setName("locked")
        .setDescription(
            "bloque un canal",
        )
        .addChannelOption((option) =>
            option
                .setName("canal")
                .setDescription(`El canal que quieres bloquear`)
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
        ),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.ManageChannels,
            )
        )
            return await interaction.reply({
                content: "❌ | No tienes permisos para ejecutar este comando.",
                ephemeral: true,
            });

        let channel = interaction.options.getChannel("canal");

        channel.permissionOverwrites.create(interaction.guild.id, {
            SendMessages: false,
        });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
                `🔒 | El canal **${channel.name}** ha sido bloqueado.`,
            );

        await interaction.reply({ embeds: [embed] });
    },
};
