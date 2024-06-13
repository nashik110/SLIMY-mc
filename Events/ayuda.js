const { Message, EmbedBuilder, ActionRowBuilder, ChatInputCommandInteraction, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, interaction) {
    if (message.author.bot) return;

    const palabraClave = 'ayudamantenimiento';

    if (message.content.toLowerCase().includes(palabraClave)) {

      const cmp = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("Menu")
            .addOptions([
              {
                label: "Menu Inicial",
                description: "Menu de Ayuda",
                value: "uno",
                emoji: "👤",
              },
              {
                label: "Comandos Administradores",
                description: "Muestra los comandos de administradores",
                value: "dos",
                emoji: "🛠",
              },
              {
                label: "Comandos Administracion Prefix",
                description: "Muestra los comandos de usuarios con prefix",
                value: "tres",
                emoji: "🛠",
              },
              {
                label: "Comandos Usuarios",
                description: "Muestra los comandos de usuarios",
                value: "cuatro",
                emoji: "👤",
              },
              {
                label: "Comandos Usuarios Prefix",
                description: "Muestra los comandos de usuarios con prefix",
                value: "cinco",
                emoji: "👤",
              },
              {
                label: "Canales INFO",
                description: "Informacion sobre los canales",
                value: "seis",
                emoji: "👤",
              },
            ])
        );

      const user = message.author;

      const embed = new EmbedBuilder()
        .setTitle("**Menu de Ayuda**")
        .setDescription('¡Hola! Si necesitas ayuda, puedes los siguientes menus para obtener información sobre diferentes categorías:\n\n- `comandos-admin`: Muestra los comandos disponibles para administradores.\n- `Comandos-Admin-Prefix`: Muestra los comandos disponibles para administradores con Prefix.\n- `comandos-usuarios`: Muestra los comandos disponibles para usuarios normales.\n- `Comandos-Usuario-Prefix`: Muestra los comandos disponibles para Usuarios con Prefix.\n\n¡Explora y diviértete! Si tienes alguna pregunta, no dudes en preguntar a nuestros moderadores.')
        .setColor("#2c2d31")
        .setImage('https://cdn.discordapp.com/avatars/1050583250038431774/7b21cf675fb4554aa2270c1059d732d0.webp?size=1024&format=webp&width=0&height=256')
        

      const sentMessage = await message.reply({
        embeds: [embed],
        components: [cmp],
        ephemeral: true,
      });

      const ifiltro = i => i.user.id === message.author.id;

      let collector = sentMessage.channel.createMessageComponentCollector({ filter: ifiltro });

      // AGREGA EMBEDS Y OPCIONES A TU GUSTO

      const embed1 = new EmbedBuilder()
        .setTitle("**Menu de Ayuda**")
        .setDescription('¡Hola! Si necesitas ayuda, puedes los siguientes menus para obtener información sobre diferentes categorías:\n\n- `comandos-admin`: Muestra los comandos disponibles para administradores.\n- `Comandos-Admin-Prefix`: Muestra los comandos disponibles para administradores con Prefix.\n- `comandos-usuarios`: Muestra los comandos disponibles para usuarios normales.\n- `Comandos-Usuario-Prefix`: Muestra los comandos disponibles para Usuarios con Prefix.\n\n¡Explora y diviértete! Si tienes alguna pregunta, no dudes en preguntar a nuestros moderadores.')
        .setColor("#2c2d31")
        .setTimestamp()
        .setImage('https://cdn.discordapp.com/avatars/1050583250038431774/7b21cf675fb4554aa2270c1059d732d0.webp?size=1024&format=webp&width=0&height=256')

      const embed2 = new EmbedBuilder()
        .setTitle("**Comandos Admin**")
        .setDescription('**›› Ménu Admin**\n\n `/ban`: <usuario> <razon> \n `/warn`: <usuario> <razon>.\n `/verwarn`: <usuario> <id_warn>\n `/unwarn`: <usuario> <id_warn>\n `/topwarns`\n `/timeout`: <usuario> <duracion>\n `/kick`: <usuario> <razon>\n `/clearwarn`: <usuario>\n `/clear`: <cantidad>\n `/emoji`: Este comando es para agregar emojis\n `/nuke`\n `/rol`: Este comando puede dar roles a usuarios, bots, todos\n `/say`: Este comando puede enviar un mensaje como el bot\n `/sorteos`\n `/suplantar`: <usuario> <mensaje>\n `/sugerencia setup`')
        .setFooter({ text: "Comandos Admin" })
        .setTimestamp()
        .setColor("#2c2d31");

      const embed3 = new EmbedBuilder()
        .setTitle("**Comandos Administracion Prefix**")
        .setDescription('**›› Ménu Admin**\n\n `?borraritem`: <id compra> <usuario>\n `?quitardinero`: <usuario> <cantidad>\n `?dardinero`: <usuario> <cantidad>')
        .setFooter({ text: "Comandos Admin Prefix" })
        .setTimestamp()
        .setColor("#2c2d31");

      const embed4 = new EmbedBuilder()
        .setTitle("**Comandos Usuarios**")
        .setDescription('**›› Ménu Usuarios**\n\n `/sugerencia enviar`: <mensaje>\n `/8ball`: <pregunta>\n `/acertijos`\n `/afk`: <razon>\n `/ascii`: <texto>\n `/dados`: <cantidad de dados>\n `/invitaciones`\n `/music play`: <nombre de la canción o enlace de YouTube>\n `/music stop`\n `/perfil`: <usuario>\n `/reporte`: <usuario> <razon>\n `/reseña`: <calificacion> <reseña>\n `/servericon`')
        .setFooter({ text: "Comandos Usuarios" })
        .setTimestamp()
        .setColor("#2c2d31");
     
      const embed5 = new EmbedBuilder()
        .setTitle("**Comandos Usuarios Prefix**")
        .setDescription('**›› Ménu Usuarios**\n**Comandos Economias:**\n\n `?billetera`: muestra tu dinero dentro de la economia\n `?lanzar`: lanza una moneda\n `?comprar`: <item>\n `?retirar`: <cantidad>\n `?depositar`: <cantidad>\n `?infoeco`: muestra los comandos de economia\n `?inventario`: muestra tu billetera\n `?diario`: recibiras dinero cada dia\n `?robar`: <usuario>\n `?tienda`: revisa la tienda del discord\n `?top -efectivo`: revisa la gente que esta en el top de efectivo\n `?top -banco`: revisa la gente que esta en el top de banco\n `?trabajar`: trabajas por un sueldo\n `?transferir`: <usuario> <cantidad>')
        .setFooter({ text: "Comandos Usuarios Prefix" })
        .setTimestamp()
        .setColor("#2c2d31");

      const embed6 = new EmbedBuilder()
        .setTitle("**Informacion Canales**")
        .setDescription('**›› Proximamente**\n')
        .setFooter({ text: "Informacion" })
        .setTimestamp()
        .setColor("#2c2d31");



      collector.on("collect", async i => {

        if (i.values[0] === "uno") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed1], components: [cmp], ephemeral: true });
          
        } else if (i.values[0] === "dos") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed2], components: [cmp], ephemeral: true });

        } else if (i.values[0] === "tres") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed3], components: [cmp], ephemeral: true  });

        } else if (i.values[0] === "cuatro") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed4], components: [cmp], ephemeral: true  });

        } else if (i.values[0] === "cinco") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed5], components: [cmp], ephemeral: true  });

        } else if (i.values[0] === "seis") {
          await i.deferUpdate();
          i.editReply({ embeds: [embed6], components: [cmp], ephemeral: true  });
        }
      });
    }
  }
}
