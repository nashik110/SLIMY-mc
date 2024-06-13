const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

// Crea un Mapa para almacenar el contador de besos
const cuentasDeBeso = new Map();

module.exports = {
  category: 'functions',
  name: "kiss",

  /**
   * @param {Message} message
   */
  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    // Verifica si el emisor del comando está intentando besarse a sí mismo
    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No puedes darte un beso a ti mismo!");
    }

    // Verifica si el bot está mencionado
    if (target.id === message.client.user.id) {
      return message.channel.send("¡No quiero un beso! 😅");
    }

    // Inicializa el contador de besos para el emisor del comando
    if (!cuentasDeBeso.has(user)) {
      cuentasDeBeso.set(user, 0);
    }

    ///////////////////////////////////
    //                               //
    //   creado by: Tobii_01_        // 
    //                               //
    //   sigan en mi ig:Tobii_01     //
    ///////////////////////////////////

    // Incrementa el contador de besos para el emisor del comando
    cuentasDeBeso.set(user, cuentasDeBeso.get(user) + 1);

    const descripcion = `**${user}** le dio un beso a **${target.username}** por ${cuentasDeBeso.get(user)} vez(es)! 😘`;

    const url = await anime.kiss(); // Suponiendo que hay un método para una animación de beso

    const embed = new EmbedBuilder()
      .setTitle("Comando de Beso")
      .setDescription(descripcion)
      .setColor("Fuchsia")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};


//es casi igual que nekotina creo o qys 