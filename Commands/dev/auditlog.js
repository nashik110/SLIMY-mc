const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js'); 

// AUDITLOGS SCHEMA

const logSchema = require("../.././Schemas/logSchema")

// AUDITLOGS SCHEMA

  module.exports = {
    category: 'dev',
    data: new SlashCommandBuilder()
      .setName("config")
      .setDescription("Configura las diferentes opciones del bot en tu servidor")
      .addSubcommand(subcommand =>
        subcommand.setName("auditlog")
        .setDescription("Creare un sistema de auditlog")
        .addChannelOption(option =>
          option.setName("log-channel")
              .setDescription("Elije un canal")
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildText)
      )
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand(["auditlog"]);

        switch (sub) {

            case "auditlog":

              try {

                const { channel, guildId, options } = interaction;
                const logChannel = options.getChannel("log-channel") || channel;

                const embed = new EmbedBuilder();

                const condata = new ActionRowBuilder()
                .addComponents(
        
                    new ButtonBuilder()
                    .setCustomId(`false`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`🔴`),

                    new ButtonBuilder()
                    .setCustomId(`true`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`🟢`)
                    .setDisabled(true),

                )

                const sindata = new ActionRowBuilder()
                .addComponents(
                    
                    new ButtonBuilder()
                    .setCustomId(`true`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`🟢`),

                    new ButtonBuilder()
                    .setCustomId(`false`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`🔴`)
                    .setDisabled(true),

                )

                const buttondesc = new ActionRowBuilder()
                .addComponents(
        
                    new ButtonBuilder()
                    .setCustomId(`desactivado`)
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('AuditLog desabilitado')
                    .setDisabled(true),

                )

                const buttonact = new ActionRowBuilder()
                .addComponents(
        
                    new ButtonBuilder()
                    .setCustomId(`activado`)
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('AuditLog habilitado')
                    .setDisabled(true),

                )

                logSchema.findOne({ Guild: guildId }, async (err, data) => {

                    if (!data) {

                        embed.setTitle(`**Config** | ${interaction.guild.name}`)
                        .setColor("#2b2d31")
                        .setDescription(
                            `\`⚙️\` El sistema de auditlog ahora mismo esta: \`🔴 Desabilitado\`\n\n\`➡️\` Usa los botones para poder activar/desactivar el sistema\n\n\`➡️\` Canal elegido para los logs: <#${logChannel.id}>`
                        )
                        .setTimestamp();

                        const tf = await interaction.reply({ embeds: [embed], components: [sindata] });

                        const coll = tf.createMessageComponentCollector();

                        coll.on("collect", async (ds) => {
                            if (ds.user.id !== interaction.user.id) return;
                
                            if (ds.customId === `true`) {
                                const embedactivado = new EmbedBuilder()
                                    .setDescription(`\`🟢\` El sistema de auditlog fue **habilitado**`)
                                    .setColor("#2b2d31");
                
                                ds.update({ embeds: [embedactivado], components: [buttonact] });
                
                                await logSchema.create({
                                    Guild: guildId,
                                    Channel: logChannel.id
                                });

                            } else if (ds.customId === `false`) {
                                const embeddesactivado = new EmbedBuilder()
                                    .setDescription(`\`🔴\` El sistema de auditlog fue **desabilitado**`)
                                    .setColor("#2b2d31");
                
                                ds.update({ embeds: [embeddesactivado], components: [buttondesc] });
                
                                await logSchema.findOneAndDelete({
                                    Guild: guildId,
                                    Channel: logChannel.id
                                });
                            }
                        });

                    }
                    if (data) {
         
                        embed.setTitle(`**Config** | ${interaction.guild.name}`)
                        .setColor("#2b2d31")
                        .setDescription(
                            `\`⚙️\` El sistema de auditlog ahora mismo esta: \`🟢 Habilitado\`\n\n\`➡️\` Usa los botones para poder activar/desactivar el sistema\n\n\`➡️\` Canal elegido para los logs: <#${logChannel.id}>`
                        )
                        .setTimestamp();

                        const tf = await interaction.reply({ embeds: [embed], components: [condata] });

                        const coll = tf.createMessageComponentCollector();

                        coll.on("collect", async (ds) => {
                            if (ds.user.id !== interaction.user.id) return;
                
                            if (ds.customId === `true`) {
                                const embedactivado = new EmbedBuilder()
                                    .setDescription(`\`🟢\` El sistema de auditlog fue **habilitado**`)
                                    .setColor("#2b2d31");
                
                                ds.update({ embeds: [embedactivado], components: [buttonact] });
                
                                await logSchema.create({
                                    Guild: guildId,
                                    Channel: logChannel.id
                                });

                            } else if (ds.customId === `false`) {
                                const embeddesactivado = new EmbedBuilder()
                                    .setDescription(`\`🔴\` El sistema de auditlog fue **desabilitado**`)
                                    .setColor("#2b2d31");
                
                                ds.update({ embeds: [embeddesactivado], components: [buttondesc] });
                
                                await logSchema.findOneAndDelete({
                                    Guild: guildId,
                                    Channel: logChannel.id
                                });
                            }
                        });

                    }
         
                    if (err) {
                        embed.setTitle(`**Config** | ${interaction.guild.name}`)
                        .setDescription(`<:cancel:1092984911654309960> **Ocurrio un error inesperado**\n\n\`🔮\` **Error:**\n\n\`${err}\``)
                    }


                });

            } catch (err) {

              const errembed = new EmbedBuilder()
              .setTitle(`**Config** | ${interaction.guild.name}`)
              .setDescription(`<:cancel:1092984911654309960> **Ocurrio un error inesperado**\n\n\`🔮\` **Error:**\n\n\`${err}\``)

              interaction.reply({ embeds: [errembed], ephemeral: true })
        
            }

                break;
          }
  }
};