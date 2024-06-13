const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const autorolschema = require('../../Schemas/autorolschema');
const { category } = require('./automod');

module.exports = {
    category: 'dev',
    data: new SlashCommandBuilder()
        .setName('autorol')
        .setDescription('Configura o elimina el sistema de autorol en tu servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Configura el sistema de autorol en tu servidor.')
                .addRoleOption(option => option.setName('role1').setDescription('Menciona el primer rol que quieres agregar.').setRequired(true))
                .addRoleOption(option => option.setName('role2').setDescription('Menciona el segundo rol que quieres agregar.').setRequired(false))
                .addRoleOption(option => option.setName('role3').setDescription('Menciona el tercer rol que quieres agregar.').setRequired(false))
                .addRoleOption(option => option.setName('role4').setDescription('Menciona el cuarto rol que quieres agregar.').setRequired(false))
                .addRoleOption(option => option.setName('role5').setDescription('Menciona el quinto rol que quieres agregar.').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Elimina el sistema de autorol configurado en el servidor.')
        ),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'setup') {
            return await executeSetup(interaction);
        } else if (interaction.options.getSubcommand() === 'delete') {
            return await executeDelete(interaction);
        }
    },
};

async function executeSetup(interaction) {
    const role1 = interaction.options.getRole('role1');
    const role2 = interaction.options.getRole('role2');
    const role3 = interaction.options.getRole('role3');
    const role4 = interaction.options.getRole('role4');
    const role5 = interaction.options.getRole('role5');

    const data = await autorolschema.findOne({ serverId: interaction.guild.id });

    if (data) {
        const embed = new EmbedBuilder()
            .setDescription(':x: El sistema de autorol ya fue configurado anteriormente...\nElimina primero el sistema de autorol con `/autorol delete` y vuelve a configurarlo.')
            .setColor('Red');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        const setupData = {
            serverId: interaction.guild.id,
            roleId1: role1,
            roleId2: role2,
            roleId3: role3,
            roleId4: role4,
            roleId5: role5,
        };

        await autorolschema.create(setupData);

        const embed = new EmbedBuilder()
            .setDescription('✅ Sistema de autorol configurado!')
            .setColor('Green');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

async function executeDelete(interaction) {
    const data = await autorolschema.findOne({ serverId: interaction.guild.id });

    if (!data) {
        const embed = new EmbedBuilder()
            .setDescription(':x: El sistema de autorol no está configurado en este servidor.')
            .setColor('Red');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        await autorolschema.deleteOne({ serverId: interaction.guild.id });

        const embed = new EmbedBuilder()
            .setDescription('✅ Sistema de autorol eliminado exitosamente!')
            .setColor('Green');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}