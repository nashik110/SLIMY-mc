const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
} = require("discord.js");

module.exports = {
    category: "dev",
    data: new SlashCommandBuilder()
        .setName("unlocked")
        .setDescription(
            "desbloquea un canal",
        )
        .addChannelOption((option) =>
            option
                .setName("canal")
                .setDescription(`El canal que quieres desbloquear`)
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
            SendMessages: true,
        });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
                `🔓 | El canal **${channel.name}** ha sido desbloqueado.`,
            );

        await interaction.reply({ embeds: [embed] });
    },
};
