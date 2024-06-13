// Importa las clases necesarias de discord.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');

// Define el constructor de comandos de barra inclinada (slash command)
const command = new SlashCommandBuilder()
    .setName('c')
    .setDescription('Elimina todos los mensajes de un usuario en el canal actual.')
    .addUserOption(option => option.setName('usuario').setDescription('El usuario cuyos mensajes serán eliminados').setRequired(true));

// Exporta el comando
module.exports = {
    category : "dev",
    data: command,
    async execute(interaction) {
        // Verifica si el usuario que ejecuta el comando tiene permisos de administrador
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
        }

        // Obtiene el usuario seleccionado del argumento de la opción
        const user = interaction.options.getUser('usuario');

        // Elimina los mensajes del usuario en el canal actual
        const fetchedMessages = await interaction.channel.messages.fetch();
        const userMessages = fetchedMessages.filter(msg => msg.author.id === user.id);
        interaction.channel.bulkDelete(userMessages);

        // Responde al usuario que ejecutó el comando
        interaction.reply({ content: `Se han eliminado todos los mensajes de ${user.tag} en este canal.`, ephemeral: true });
    },
};