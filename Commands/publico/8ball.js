const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
  } = require("discord.js");
const { category } = require("../musica/musica");
  
  module.exports = {
    category: 'functions',
    data: new SlashCommandBuilder()
      .setName("8ball")
      .setDescription("Te respondere a tus preguntas")
      .addStringOption((option) =>
        option
          .setName(`pregunta`)
          .setDescription(`Describe tu pregunta`)
          .setRequired(true)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const pregunta = interaction.options.getString(`pregunta`);
  
      let respuestas = [
        "Si",
        "No",
        "No lo se",
        "Quiza",
        "Puede que si",
        "Puede que no",
        "Claramente si",
        "Claramente no",
      ];
  
      const respuesta = Math.floor(Math.random() * respuestas.length);
  
      const embed = new EmbedBuilder().addFields(
        {
          name: `Pregunta`,
          value: `${pregunta}`,
        },
        { name: `Respuesta`, 
        value: `${respuestas[respuesta]}` }
      )
      .setDescription("🎱 Bola mágica de Devil")
      .setColor("White");

      await interaction.reply({ embeds: [embed] });
    },
  };