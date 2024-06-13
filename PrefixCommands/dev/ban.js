const { category } = require("../publico/slap");

module.exports = {
    category: 'dev',
    execute: async function (message) {

      // Obtener al usuario mencionado en el mensaje
      const userToBan = message.mentions.members.first();
      // Verificar si el bot tiene permisos para banear miembros
      if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
        return message.reply('No tengo los permisos necesarios para banear miembros.');
      }
      // Verificar si el usuario tiene permiso para banear miembros
      else if (!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply('No tienes permisos para banear miembros.');
      }
    
      else if (userToBan.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
        return message.reply('No puedo banear a este usuario debido a que su rol es igual o más alto que el mío.');
      }
  
      // Verificar si se mencionó a un usuario
      else if (!userToBan) {
        return message.reply('Debes mencionar a un usuario.');
      }

        // Verificar si el usuario a banear es el dueño del servidor
      else if (userToBan.id === message.guild.ownerId) {
        return message.reply('No puedes banear al dueño del servidor.');
      }
      

      // Verificar si el usuario a banear tiene un rol superior o igual al del autor del mensaje
      else if (userToBan.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
        return message.reply('No puedes banear a un usuario con un rol igual o superior al tuyo.');
      }
  
      // Verificar si el usuario a banear es el mismo autor del mensaje
      else if (userToBan.id === message.author.id) {
        return message.reply('No puedes banearte a ti mismo.');
      }
  
      // Verificar si el usuario a banear es el mismo bot
      else if (userToBan.id === message.client.user.id) {
        return message.reply('No puedo banearme a mí mismo.');
      }
  
    
      // Intentar banear al usuario
      try {
        await userToBan.ban({ reason: 'Razón opcional del ban.' });
        message.reply(`El usuario ${userToBan.user.tag} ha sido baneado.`);
      } catch (error) {
        console.error(error);
        message.reply('Hubo un error al intentar banear al usuario.');
      }
    },
  };
  
  // creditos: towers 66