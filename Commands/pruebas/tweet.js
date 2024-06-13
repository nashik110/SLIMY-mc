const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    category: 'admin',
  data: new SlashCommandBuilder()
    .setName("tw")
    .setDescription("Haz que los usuarios tuiteen algo ;)")
    .addStringOption(option => option.setName("tweet").setDescription("Twittear comentario").setRequired(true))
    .addUserOption(option => option.setName("usuario").setDescription("Elegir un usuario").setRequired(false)),
    async execute (interaction) {
        let tweet = interaction.options.getString("tweet");
        let user = interaction.options.getUser("usuario") || interaction.user;
        let avatarUrl = user.avatarURL({ extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/tweet?avatar=${avatarUrl}&displayname=${encodeURIComponent(user.username)}&username=${encodeURIComponent(user.username)}&comment=${encodeURIComponent(tweet)}`;

        await interaction.channel.sendTyping(), await interaction.channel.send({content: canvas });
        await interaction.reply({ content: "Envió el tweet de imagen", ephemeral: true});
    },
};