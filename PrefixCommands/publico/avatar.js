const { EmbedBuilder } = require("discord.js");

module.exports = {
    category: "functions",
    name: "avatar",
    description: 'Ve el avatar de un usuario',

    async execute(message, args, client) {

        const juan = message.author;
        const target = message.mentions.users.first() || message.author;
        const thedevasting = await message.guild.members.fetch(target.id);

        if (!thedevasting) return message.reply("Introduce un usuario válido!");
            const hiperbot = thedevasting.user.displayAvatarURL({ size: 512})

        const carlosjuan = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`AVATAR DE ${thedevasting.user.displayName}! :white_check_mark:`)
        .setDescription(`${juan} Ha solicitado el avatar de ${target}!`)
        .setImage(hiperbot)
        .setFooter({ text: `User ID: ${juan.id}`});

        message.channel.send({ embeds: [carlosjuan] });
        }
}