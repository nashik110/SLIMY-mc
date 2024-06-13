const { 
    EmbedBuilder 
} = require("discord.js");
const internal = require("stream");
 
function logHandler(client) {
 
  // Import Log Schema  
  const logSchema = require("../Schemas/logSchema");
 
  async function send_log(guildId, embed) {
    try {
      const data = await logSchema.findOne({ Guild: guildId });
      if (!data || !data.Channel) return;
 
      const logChannel = client.channels.cache.get(data.Channel);
      if (!logChannel) return;
 
      embed.setTimestamp();
 
      logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
 
    // Message Delete Log
 
    client.on("messageDelete", function (message) {
        if (message.author.bot) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`Mensaje eliminado`)
            .setColor("#2b2d31")
            .setDescription(`
            **Autor**: <@${message.author.id}>\n**Dato**: ${message.createdAt}\n**Canal**: <#${message.channel.id}>\n**Contenido**: ${message.content.replace(/`/g, "`")}`);
 
        return send_log(message.guild.id, embed);
    });
 
    // Channel Topic Update Log
 
    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de topico actualizado`)
            .setColor("#2b2d31")
            .setDescription(`${channel} **topico** fue actualizado.\n**Anterior**: ${oldTopic}\n**Nuevo**: ${newTopic}`);
 
        return send_log(channel.guild.id, embed);
 
    });
 
    // Channel Permission Update Log
 
    client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Permisos del canal actualizados`)
            .setColor("#2b2d31")
            .setDescription(`${channel.name} permisos actualizados.\n**Anterior**: ${oldPermissions}\n**Nuevo**: ${newPermissions}`);
 
        return send_log(channel.guild.id, embed);
 
    })
 
    // Guild Channel Update
    client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal actualizado`)
            .setColor("#2b2d31")
            .setDescription(`Un canal del servidor fue actualizado.\n**Anterior**: ${oldChannel}\n**Nuevo**: ${newChannel}`);
 
        return send_log(oldChannel.guild.id, embed);
 
    });
 
    // Member Boosted
 
    client.on("guildMemberBoost", (member) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo boost`)
            .setColor(`#2b2d31`)
            .setDescription(`**${member.user.tag}** empezo a boostear el servidor ${member.guild.name}!`);
        return send_log(member.guild.id, embed);
 
    })
 
    // Member Unboosted
 
    client.on("guildMemberUnboost", (member) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Boost menos`)
            .setColor(`#2b2d31`)
            .setDescription(`**${member.user.tag}** dejo de boostear el servidor ${member.guild.name}.`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Member Add-Role
 
    client.on("guildMemberRoleAdd", (member, role) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo rol hacia un miembro`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** recibio ${role.name}.`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Member Remove-Role
 
    client.on("guildMemberRoleRemove", (member, role) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo rol eliminado hacia un miembro`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** se le removio ${role.name}.`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Member Nickname Update
 
    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nick actualizado`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** cambio su nick.\n**Anterior**: ${oldNickname}\n**Nuevo**: ${newNickname}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Member Joined Server
 
    client.on("guildMemberAdd", (member) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo miembro`)
            .setColor("#2b2d31")
            .setDescription(`${member.user} entro a **${member.guild.name}**!`,
                member.user.displayAvatarURL({ dynamic: true }));
 
        return send_log(member.guild.id, embed);
 
    });
 
    // Member Left Server
 
    client.on("guildMemberRemove", (member) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Salida de un miembro`)
            .setColor("#2b2d31")
            .setDescription(`${member.user} salio de **${member.guild.name}**.`,
                member.user.displayAvatarURL({ dynamic: true }));
 
        return send_log(member.guild.id, embed);
 
    });
 
    // Server Boost Level Up
 
    client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo nivel de boost`)
            .setColor(`Pink`)
            .setDescription(`**${guild.name}** llego al nivel de boost **${newLevel}**!`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Server Boost Level Down
 
    client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo nivel de boost`)
            .setColor(`Pink`)
            .setDescription(`**${guild.name}** perdio el nivel **${oldLevel}** a **${newLevel}**.`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Server Banner Add
 
    client.on("guildBannerAdd", (guild, bannerURL) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Nuevo banner del servidor`)
            .setColor("#2b2d31")
            .setImage(bannerURL)
 
        return send_log(guild.id, embed);
 
    })
 
    // AFK Channel Add
 
    client.on("guildAfkChannelAdd", (guild, afkChannel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Actualizacion del servidor`)
            .setColor("#2b2d31")
            .setDescription(`**${guild.name}** tiene un nuevo canal afk ${afkChannel}.`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Guild Vanity Add
 
    client.on("guildVanityURLAdd", (guild, vanityURL) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Link de invitacion`)
            .setColor("#2b2d31")
            .setDescription(`**${guild.name}** tiene su propio enlace\n**Link**: ${vanityURL}`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Guild Vanity Remove
 
    client.on("guildVanityURLRemove", (guild, vanityURL) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Link de invitacion`)
            .setColor("#2b2d31")
            .setDescription(`**${guild.name}** se elimino su propio link.\n**Link**: ${vanityURL}`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Guild Vanity Link Update
 
    client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Link de invitacion`)
            .setColor("#2b2d31")
            .setDescription(`**${guild.name}** actualizo su propio link!\n**Anterior**: ${oldVanityURL}\n**Nuevo**: ${newVanityURL}`);
 
        return send_log(guild.id, embed);
 
    })
 
    // Message Pin
 
    client.on("messagePinned", (message) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Mensaje con pin`)
            .setColor(`#2b2d31`)
            .setDescription(`${message} utilizo el pin ${message.author}.`);
 
        return send_log(message.guild.id, embed);
 
    })
 
    // Message Edit
 
    client.on("messageContentEdited", (message, oldContent, newContent) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Mensaje editado`)
            .setColor(`#2b2d31`)
            .setDescription(`**Anterior**: ${oldContent}\n**Nuevo**: ${newContent}\n**Autor**: ${message.author}`);
 
        return send_log(message.guild.id, embed);
 
    })
 
    // Role Position Update
 
    client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Posision del rol`)
            .setColor("#2b2d31")
            .setDescription(`**${role.name}** la posicion del rol fue actualizada.\n**Anterior**: ${oldPosition}\n**Nueva**: ${newPosition}`);
 
        return send_log(role.guild.id, embed);
 
    })
 
    // Role Permission Update
 
    client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Permisos del rol`)
            .setColor("#2b2d31")
            .setDescription(`**${role.name}** se actualizaron los permisos.\n**Anterior**: ${oldPermissions}\n**Nuevo**: ${newPermissions}`);
 
        return send_log(role.guild.id, embed);
 
    })
 
    // Username Update
 
    client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Username actualizado`)
            .setColor("#2b2d31")
            .setDescription(`${user.tag} actualizo su username.\n**Anterior**: ${oldUsername}\n**Nuevo**: ${newUsername}`);
 
        return send_log(user.guild.id, embed);
 
    })
 
    // Discriminator Update
 
    client.on("userDiscriminatorUpdate", (user, oldDiscriminator, newDiscriminator) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Discriminator actualizado`)
            .setColor("#2b2d31")
            .setDescription(`**${user.tag}** actualizo su discriminator.\n**Anterior**: ${oldDiscriminator}\n**Nuevo**: ${newDiscriminator}`);
 
        return send_log(user.guild.id, embed);
 
    })
 
    // Joined Voice Channel
 
    client.on("voiceChannelJoin", (member, channel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** entro a ${channel}.`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Left Voice Channel
 
    client.on("voiceChannelLeave", (member, channel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** salio de ${channel}.`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Voice Channel Switch
 
    client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** se cambio de canal.\n**Anterior**: ${oldChannel}\n**Nuevo**: ${newChannel}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Voice Channel Mute
 
    client.on("voiceChannelMute", (member, muteType) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** se muteo.\n**Tipo**: ${muteType}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Voice Channel Unmute
 
    client.on("voiceChannelUnmute", (member, oldMuteType) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** se desmuteo.\n**Tipo**: ${oldMuteType}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Voice Channel Defean
 
    client.on("voiceChannelDeaf", (member, deafType) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** se ensordecio.\n**Tipo**: ${deafType}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // Voice Channel Undefean
 
    client.on("voiceChannelUndeaf", (member, deafType) => {
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** no tiene mas el ensordecido.\n**Tipo**: ${deafType}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // User Started to Stream
 
    client.on("voiceStreamingStart", (member, voiceChannel) => {
 
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** inicio una transmision.\n**Canal**: ${voiceChannel}`);
 
        return send_log(member.guild.id, embed);
 
    })
 
    // User Stopped to Stream
 
    client.on("voiceStreamingStop", (member, voiceChannel) => {
 
 
        const embed = new EmbedBuilder()
            .setTitle(`Canal de voz`)
            .setColor("#2b2d31")
            .setDescription(`**${member.user.tag}** freno una transmision.\n**Canal**: ${voiceChannel}`);
 
        return send_log(member.guild.id, embed);
    });
 
 
    // Role Create
 
    client.on("roleCreate", async (role) => {
        const logs = await role.guild.fetchAuditLogs({ limit: 1, type: 30 });
        const log = logs.entries.first();
 
        const embed = new EmbedBuilder()
          .setTitle(`Nuevo rol`)
          .setColor("#2b2d31")
          .setDescription(`${role}/${role.name} fue creado por <@${log.executor.id}>.`);
 
        return send_log(role.guild.id, embed);
      });
 
 
    // Role Delete
 
    client.on("roleDelete", async (role) => {
        const logs = await role.guild.fetchAuditLogs({ limit: 1, type: 32 });
        const log = logs.entries.first();
 
        const embed = new EmbedBuilder()
          .setTitle(`Rol eliminado`)
          .setColor("#2b2d31")
          .setDescription(`${role}/${role.name} fue eliminado por <@${log.executor.id}>.`);
 
        return send_log(role.guild.id, embed);
      });
 
 
    // User Ban
 
    client.on("guildBanAdd", async ({ guild, user }) => {
        const logs = await guild.fetchAuditLogs({ limit: 1, type: 22 });
        const log = logs.entries.first();
 
        const embed = new EmbedBuilder()
          .setTitle(`Nuevo baneo`)
          .setColor("#2b2d31")
          .setDescription(`${user}/${user.id} fue baneado por <@${log.executor.id}>.`);
 
        return send_log(guild.id, embed);
      });
 
 
    // User Unban
 
    client.on("guildBanRemove", async ({ guild, user }) => {
        const logs = await guild.fetchAuditLogs({ limit: 1, type: 22 });
        const log = logs.entries.first();
        const executor = log.executor;
        const embed = new EmbedBuilder()
          .setTitle(`Nuevo desbaneo`)
          .setColor("#2b2d31")
          .setDescription(`${user}/${user.id} fue desbaneado por <@${executor.id}>.`);
 
        return send_log(guild.id, embed);
      });      
 
    // Channel Create
 
    client.on("channelCreate", async (channel) => {
        const auditLogs = await channel.guild.fetchAuditLogs({
          limit: 1,
          type: 10 
        });
 
        const entry = auditLogs.entries.first();
        if (!entry) return;
 
        const user = entry.executor;
 
        const embed = new EmbedBuilder()
          .setTitle(`Nuevo canal`)
          .setColor("#2b2d31")
          .setDescription(`${channel.name} fue creado por ${user}.`);
 
        return send_log(channel.guild.id, embed);
    });
 
    // Channel Delete
 
    client.on("channelDelete", async (channel) => {
        const auditLogs = await channel.guild.fetchAuditLogs({
          limit: 1,
          type: 12
        });
 
        const entry = auditLogs.entries.first();
        if (!entry) return;
 
        const user = entry.executor;
 
        const embed = new EmbedBuilder()
          .setTitle(`Canal eliminado`)
          .setColor("#2b2d31")
          .setDescription(`${channel.name} fue eliminado por ${user}.`);
 
        return send_log(channel.guild.id, embed);
    });
}
 
module.exports = { logHandler };