const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../Schemas/afkSchema');

module.exports = {
    category : "functions",
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Establece un mensaje de ausente (AFK).')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Establece un mensaje de ausente (AFK).')
                .addStringOption(option =>
                    option
                        .setName('message')
                        .setDescription('Motivo para estar AFK.')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Quitar AFK.')
        ),
    async execute(interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        switch (sub) {
            case 'set':
                if (Data) {
                    return await interaction.reply({ content: `Ya estás AFK en este servidor.`, ephemeral: true });
                } else {
                    const message = options.getString('message') || 'Sin motivo';
                    const nickname = interaction.member.nickname || interaction.user.username;
                    const name = `[AFK] ${nickname}`;

                    await afkSchema.create({
                        Guild: interaction.guild.id,
                        User: interaction.user.id,
                        Message: message,
                        Nickname: nickname,
                    });

                    console.log("Estableciendo nickname...");
                    await interaction.member.setNickname(name).catch(err => {
                        console.error(err);
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('AFK ESTABLECIDO')
                        .setDescription(`**Motivo:** ${message}`)
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
                        })
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024, position: 'right' }));

                    embed.setFooter({
                        text: 'Avisaré a quienes te mencionen.'
                    });

                    await interaction.reply({ embeds: [embed] });
                }
                break;

            case 'remove':
                if (!Data) {
                    return await interaction.reply({ content: `No estás AFK en este servidor.`, ephemeral: true });
                } else {
                    const nick = Data.Nickname;

                    await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id });

                    await interaction.member.setNickname(nick).catch(err => {
                        console.error(err);
                    });

                    const embed = new EmbedBuilder()
                        .setColor(3447003)
                        .setDescription(':white_check_mark: ¡Tu estado AFK ha sido eliminado!');

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
        }
    }
}