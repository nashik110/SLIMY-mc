const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ChatInputCommandInteraction,
    ButtonStyle,
    ButtonBuilder,
    ComponentType,
} = require("discord.js");
const axios = require("axios");
const spamDetection = require("../../Schemas/spamDetection");

module.exports = {
    category: 'dev',
    data: new SlashCommandBuilder()
        .setName("automod")
        .setDescription("Landa un sistema de autoMod")
        .addSubcommand((command) =>
            command
                .setName("anti-links")
                .setDescription("bloquea todos los links en este servidor")
                .addChannelOption((option) =>
                    option
                        .setName("alert-channel")
                        .setDescription("Canal para enviar alertas")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("canal permitido para enviar links")
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addRoleOption((option) =>
                    option
                        .setName("rol")
                        .setDescription("Rol permitido para enviar links")
                )
        )
        .addSubcommand((command) =>
            command
                .setName("mention-spam")
                .setDescription("Bloquea el spam de menciones")
                .addChannelOption((option) =>
                    option
                        .setName("mentions-alert")
                        .setDescription("Canal para enviar alertas")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("timeout")
                        .setDescription(
                            "Aislar al miembro, maximo 40320 minutos (4 weeks)"
                        )
                )
        )
        .addSubcommand((command) =>
            command
                .setName("spam-messages")
                .setDescription("Bloquea los mensajes de spam")
                .addStringOption((option) =>
                    option
                        .setName("mensajes-duplicados")
                        .setDescription(
                            "Activa o descativa la deteccion de mensajes duplicados."
                        )
                        .addChoices(
                            {
                                name: `Activar Anti mensajes Duplicados`,
                                value: `activar`,
                            },
                            {
                                name: `Desactivar Anti mensajes Duplicados`,
                                value: `desactivar`,
                            }
                        )
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName("alert-channel")
                        .setDescription("Canal para enviar las alertas")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "canal permitido para enviar mensajes duplicados"
                        )
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addRoleOption((option) =>
                    option
                        .setName("rol")
                        .setDescription(
                            "Rol permitido para enviar mensajes duplicados"
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("max-duplcate")
                        .setDescription(
                            "Escribe el numero maximo de veces que pueden enviar un mismo mensaje en menos de 5 minutos."
                        )
                )
        )
        .addSubcommand((command) =>
            command
                .setName("keyword")
                .setDescription(
                    "Bloquea una palabra especidifca en este servidor"
                )
                .addStringOption((option) =>
                    option
                        .setName("word")
                        .setDescription("Escribe la palabra a bloquear")
                        .setRequired(true)
                )
        )
        .addSubcommand((command) =>
            command
                .setName("anti-invites")
                .setDescription("Bloquea todas las invitaciones de discord")
        )
        .addSubcommand((command) =>
            command
                .setName("flagged-words")
                .setDescription(
                    "Bloquea el contenido sexual, profano o los insultos"
                )
        )
        .addSubcommand((command) =>
            command
                .setName("lista")
                .setDescription(
                    "Muestra una lista con las reglas de AutoModeracion del servidor."
                )
        )
        .addSubcommand((command) =>
            command
                .setName("eliminar")
                .setDescription(
                    "Elimina una regla de AutoModeracion del servidor."
                )
                .addStringOption((option) =>
                    option
                        .setName("regla")
                        .setDescription(
                            "ingresa el iD de la regla que quieres eliminar"
                        )
                        .setRequired(true)
                )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const { guild, options, client } = interaction;
        const sub = options.getSubcommand();

        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        )
            return await interaction.reply({
                content: `No tienes permisos para usar este comando en este servidor.`,
                ephemeral: true,
            });

        try {
            switch (sub) {
                case "flagged-words":
                    try {
                        await interaction.reply({
                            content: `Configurando regla de autoMod...`,
                        });
                        const rule = await guild.autoModerationRules
                            .create({
                                name: `Bloqueo de palabras marcadas by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 4,
                                triggerMetadata: {
                                    baseType: 4,
                                    presets: [1, 2, 3],
                                    allowList: [],
                                    regexPatterns: [],
                                },
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: interaction.channel,
                                            durationSeconds: 10,
                                            customMessage: `Mensaje bloqueado by ${client.user.tag}. sistema de AutoMod.`,
                                        },
                                    },
                                ],
                            })
                            .catch(async (err) => {
                                await interaction.editReply({
                                    content: `Se alcanzo el maximo de reglas de este tipo, para eliminar una regla usa </automod eliminar:1109583268023648296> regla <ID DE LA REGLA A ELIMINAR>\nO para obtener el listado de las reglas de automoderacion de este servidor usa </automod lista:1109583268023648296>`,
                                });
                            });

                        if (!rule) return;
                        const embed = new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `Regla de AutoMod creada by ${client.user.tag}, todo el contenido marcado sera bloqueado`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta reglinvite\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }
                    break;

                case "keyword":
                    try {
                        await interaction.reply({
                            content: `Creando regla de AutoMod`,
                        });
                        const word = options.getString("word");
                        const rule2 = await guild.autoModerationRules
                            .create({
                                name: `Palabra bloqueada ${word} by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 1,
                                triggerMetadata: {
                                    keywordFilter: [`${word}`],
                                },
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: interaction.channel,
                                            durationSeconds: 10,
                                            customMessage: `Mensaje bloquado by ${client.user.tag}. sistema de AutoMod.`,
                                        },
                                    },
                                ],
                            })
                            .catch(async (err) => {
                                await interaction.editReply({
                                    content: `Se alcanzo el maximo de reglas de este tipo, para eliminar una regla usa </automod eliminar:1109583268023648296> regla <ID DE LA REGLA A ELIMINAR>\nO para obtener el listado de las reglas de automoderacion de este servidor usa </automod lista:1109583268023648296>`,
                                });
                            });

                        if (!rule2) return;
                        const embed2 = new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `Regla creada correctamente, la palabra ${word} esta bloquada en el servidor. by ${client.user.tag}`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed2],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta regla.\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }
                    break;

                case "spam-messages":
                    const permch = options.getChannel("channel");
                    const permrol = options.getRole("rol");
                    const alertch = options.getChannel("alert-channel")?.id;
                    const maxDp = options.getString("max-duplcate");
                    const spamDp = options.getString("mensajes-duplicados");
                    const guildId = guild.id;

                    const spamDel = await spamDetection.findOne({
                        guildId: guildId,
                    });

                    if (spamDp === "activar") {
                        if (spamDel) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: `Spam Detection`,
                                    iconURL: client.user.displayAvatarURL(),
                                })
                                .addFields({
                                    name: `❌ | Error`,
                                    value: `Este servidor ya tiene un sistema anti-spam de mensajes activo.`,
                                })
                                .setColor("Red")
                                .setFooter({
                                    text: `${client.user.tag} || ${client.ws.ping}Ms`,
                                    iconURL: client.user.displayAvatarURL(),
                                });
                            return interaction.reply({ embeds: [embed] });
                        } else {
                            const spamDel = new spamDetection({
                                guildId: guildId,
                                permCh: permch?.id,
                                permRole: permrol?.id,
                                alertChannel: alertch,
                                maxDuplicate: maxDp,
                            });
                            await spamDel.save();
                        }
                    } else if (spamDp === "desactivar") {
                        await spamDetection.findOneAndDelete({
                            guildId: interaction.guild.id,
                        });
                    }

                    try {
                        await interaction.reply({
                            content: `Creando regla de AutoMod`,
                        });

                        const rule3 = await guild.autoModerationRules
                            .create({
                                name: `Anti Spam by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 3,
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: alertch,
                                            durationSeconds: 10,
                                            customMessage: `Mensaje bloquado by ${client.user.tag.toLowerCase()} sistema de AutoMod.`,
                                        },
                                    },
                                    {
                                        type: 2,
                                        metadata: { channel: `${alertch}` },
                                    },
                                ],
                                exemptChannels: permch ? [permch.id] : [],
                                exemptRoles: permrol ? [permrol.id] : [],
                            })
                            .catch(async (error) => {
                                if (spamDp === "desactivar") {
                                    await spamDetection.findOneAndDelete({
                                        guildId: guildId,
                                    });
                                    await interaction.editReply({
                                        content: `> Haz alcanzado el limite de reglas de este tipo.\nTenias la dereccion de mensajes duplicados activa, Pero como haz seleccionado mensajes-duplicados "Desactivar Anti Mensajes Duplicados" la he descativado\nSi quieres eliminar una regla usa </automod eliminar:1109583268023648296> regla:<ID DE LA REGLA>\nPara ver el ID de usa regla usa </automod lista:1109583268023648296>\nSi tienes dudas sobre como configurar este sistema puedes unirte a mi [servidor de soporte](https://discord.gg/2ZKdT6SRsZ) para recibir ayuda.\n${error}`,
                                    });
                                    return;
                                }
                                if (spamDp === "activar") {
                                    await interaction.editReply({
                                        content: `> Haz alcanzado el limite de reglas de este tipo.\nTenias la dereccion de mensajes duplicados Desactivada, Pero como haz seleccionado mensajes-duplicados "Activar Anti Mensajes Duplicados" la he Activado\n\nSi quieres eliminar una regla usa </automod eliminar:1109583268023648296> regla:<ID DE LA REGLA>\nPara ver el ID de usa regla usa </automod lista:1109583268023648296>\nSi tienes dudas sobre como configurar este sistema puedes unirte a mi [servidor de soporte](https://discord.gg/2ZKdT6SRsZ) para recibir ayuda.\n${error}`,
                                    });
                                    return;
                                }
                            });

                        if (!rule3) return;

                        const embed3 = new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `Regla creada correctamente, todo mensaje sospechoso de spam sera bloqueado by ${client.user.tag}`
                            )
                            .addFields(
                                {
                                    name: `> Canal para las alertas.`,
                                    value: `${alertch || "No definido"}`,
                                },
                                {
                                    name: `Canal donde esta permitido enviar mensajes duplicados.`,
                                    value: `${permch || "No definido"}`,
                                },
                                {
                                    name: `Rol que tiene permitido hacer spam.`,
                                    value: `${permrol || "No definido"}`,
                                },
                                {
                                    name: `Cantidad de veces maxima que se puede enviar un mismo mensaje en menos de 5 minutos.`,
                                    value: `${maxDp || "No definido"}`,
                                },
                                {
                                    name: `Deteccion de mensajes duplicados`,
                                    value: `${spamDp || "3"}`,
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed3],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta regla.\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }

                    break;

                case "mention-spam":
                    const aChannel =
                        interaction.options.getChannel("mentions-alert");
                    const timeoutSecons =
                        interaction.options.getInteger("timeout");
                    const timeoutM = timeoutSecons * 60;

                    try {
                        await interaction.reply({
                            content: `Creando regla de AutoMod`,
                        });
                        const rule4 = await guild.autoModerationRules
                            .create({
                                name: `Anti Spam de menciones by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 1,
                                triggerMetadata: {
                                    regexPatterns: [
                                        "((<@[&!]?[\\d]+>\\s*){4,}|(<#[&!]?[\\d]+>\\s*){4,}|(<@&[\\d]+>\\s*){4,}|(@\\S+\\s*){4,})",
                                    ],
                                },
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: interaction.channel,
                                            durationSeconds: 10,
                                            customMessage: `Mensaje bloquado by ${client.user.tag} sistema de AutoMod.`,
                                        },
                                    },
                                    {
                                        type: 2,
                                        metadata: { channel: `${aChannel.id}` },
                                    },
                                    {
                                        type: 3,
                                        metadata: {
                                            durationSeconds: timeoutM || 60,
                                        },
                                    },
                                ],
                            })
                            .catch(async (err) => {
                                await interaction.editReply({
                                    content: `Se alcanzo el maximo de reglas de este tipo, para eliminar una regla usa </automod eliminar:1109583268023648296> regla <ID DE LA REGLA A ELIMINAR>\nO para obtener el listado de las reglas de automoderacion de este servidor usa </automod lista:1109583268023648296>`,
                                });
                            });

                        if (!rule4) return;
                        const embed4 = new EmbedBuilder()
                            .setColor("Random")
                            .addFields(
                                {
                                    name: `Canal para enviar alertas`,
                                    value: `${aChannel} Para alertas de intento de spam de menciones.`,
                                },
                                {
                                    name: `Sancion establecida:`,
                                    value: `**${
                                        timeoutSecons
                                            ? `${timeoutM} minutos`
                                            : `60 segundos`
                                    }** Tiempo de aislamiento.`,
                                }
                            )
                            .setDescription(
                                `Regla creada correctamente, todo mensaje con exceso de menciones sera bloqueado. by ${client.user.tag}`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed4],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta regla.\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }
                    break;

                case "anti-links":
                    const permChannel =
                        interaction.options.getChannel("channel");
                    const alertChannel =
                        interaction.options.getChannel("alert-channel");
                    const permRol = interaction.options.getRole("rol");
                    try {
                        await interaction.reply({
                            content: `Creando regla de AutoMod`,
                        });
                        const rule5 = await guild.autoModerationRules
                            .create({
                                name: `Anti Links by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 1,
                                triggerMetadata: {
                                    regexPatterns: ["\\b(?:https?://)?\\S+.\\S+\\b"],
                                    allowList: [
                                        "*.gif",
                                        "*.jpeg",
                                        "*.jpg",
                                        "*.png",
                                        ".webp*",
                                        "*https://open.spotify.com/*",
                                        "*https://tenor.com/*",
                                    ],
                                },
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: interaction.channel,
                                            durationSeconds: 10,
                                            customMessage: `Links bloquados por by ${client.user.tag}. sistema de AutoMod.`,
                                        },
                                    },
                                    {
                                        type: 2,
                                        metadata: {
                                            channel: `${alertChannel.id}`,
                                        },
                                    },
                                ],
                                exemptChannels: permChannel
                                    ? [permChannel.id]
                                    : [],
                                exemptRoles: permRol ? [permRol.id] : [],
                            })
                            .catch(async (err) => {
                                await interaction.editReply({
                                    content: `Se alcanzo el maximo de reglas de este tipo, para eliminar una regla usa </automod eliminar:1109583268023648296> regla <ID DE LA REGLA A ELIMINAR>\nO para obtener el listado de las reglas de automoderacion de este servidor usa </automod lista:1109583268023648296>`,
                                });
                            });

                        if (!rule5) return;
                        const embed5 = new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `Regla creada correctamente, ahora todos los links son bloqueados, escepto los de spotify. by ${client.user.tag}.`
                            )
                            .addFields(
                                {
                                    name: `Canal para enviar alertas`,
                                    value: `${alertChannel} Para alertas de intento de enviar links.`,
                                },
                                {
                                    name: `Canal permitido:`,
                                    value: `**${
                                        permChannel
                                            ? `${permChannel}`
                                            : `Ningun canal`
                                    }** esta habilitado para que cualquier miembro envie links.`,
                                },
                                {
                                    name: `Rol permitodo:`,
                                    value: `**${
                                        permRol ? `${permRol}` : `Ningun Rol`
                                    }** tiene permitido enviar links en todo el servidor.`,
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed5],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta regla.\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }
                    break;

                case "anti-invites":
                    try {
                        const alertChannel =
                            interaction.options.getChannel("alert-channel");
                        await interaction.reply({
                            content: `Creado regla de AutoMod`,
                        });
                        const rule6 = await guild.autoModerationRules
                            .create({
                                name: `Anti Invitaciones by: ${client.user.tag}`,
                                creatorId: `${client.user.id}`,
                                enabled: true,
                                eventType: 1,
                                triggerType: 1,
                                triggerMetadata: {
                                    regexPatterns: [ "\\b(?:www\\.)?(?:discord\\.gg|discordapp\\.com/invite|diss?\\.gg|discords?\\.gg)/\\S+\\b", ],
                                },
                                actions: [
                                    {
                                        type: 1,
                                        metadata: {
                                            channel: interaction.channel,
                                            durationSeconds: 10,
                                            customMessage: `Invitaciones bloquadas by ${client.user.tag}.`,
                                        },
                                    },
                                ],
                            })
                            .catch(async (err) => {
                                await interaction.editReply({
                                    content: `Se alcanzo el maximo de reglas de este tipo, para eliminar una regla usa </automod eliminar:1109583268023648296> regla <ID DE LA REGLA A ELIMINAR>\nO para obtener el listado de las reglas de automoderacion de este servidor usa </automod lista:1109583268023648296>`,
                                });
                            });

                        if (!rule6) return;
                        const embed6 = new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `Regla creada correctamente, ahora todas las invitaciones de otros servidores son bloqueadas. by ${client.user.tag}`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });
                        await interaction.editReply({
                            content: ``,
                            embeds: [embed6],
                        });
                    } catch (error) {
                        await interaction.editReply({
                            content: `Ocurrio un error al intentar crear esta regla.\nSi el error persiste por favor ponte en contacto con mi desarrollador.\nCodido de error \`${error}\``,
                        });
                    }
                    break;

                case "lista":
                    try {
                        const guildId = interaction.guild.id;
                        const guildToken = interaction.client.token;
                        const emojiId = `<:xb:1112140703670214786>`;
                        const url = `https://discord.com/oauth2/authorize?client_id=1221995267390181427&permissions=8&scope=bot`;

                        const buttonAyuda =
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Soporte`)
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(`https://discord.gg/N3yP36Cq7s`),

                                new ButtonBuilder()
                                    .setLabel(`Invitarme`)
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(url),

                                new ButtonBuilder()
                                    .setLabel("Mas informacion")
                                    .setStyle(ButtonStyle.Link)
                                    .setURL("https://www.instagram.com/fannyy_lpz?igsh=d3Zsczd0aml5OHoy&utm_source=qr")
                            );

                        const response = await axios.get(
                            `https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules`,
                            {
                                headers: {
                                    Authorization: `Bot ${guildToken}`,
                                },
                            }
                        );
                        const automodRules = response.data;
                        const actionTypes = {
                            1: "Bloquear mensaje",
                            2: "Enviar alerta",
                            3: "Aislar miembro",
                        };

                        const cmpAutomod = new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("MenuRules")
                                .addOptions([
                                    {
                                        label: "Todas Las reglas",
                                        description: "Lista de reglas",
                                        value: "PrincipalRules",
                                        emoji: "<:home:1148722257930240093>",
                                    },
                                ])
                        );

                        const embed = new EmbedBuilder()
                            .setTitle(
                                "Reglas de Auto Moderación en este servidor."
                            )
                            .setColor("e7453c");

                        if (automodRules.length === 0) {
                            embed
                                .addFields(
                                    {
                                        name: "> Información no disponible.",
                                        value: "No encontre ninguna regla de Auto Moderación en este servidor.",
                                    },
                                    {
                                        name: "> Si quieres crear algunas reglas.",
                                        value: "Puedes usar mi comando </automod anti-links:1109583268023648296>.\n",
                                    }
                                )
                                .setImage(
                                    `https://cdn.discordapp.com/attachments/1108782554762461234/1111041086304047204/automod.png`
                                );
                            await interaction.reply({ embeds: [embed] });
                        } else {
                            automodRules.forEach(async (rule) => {
                                const exemptRoles =
                                    rule.exempt_roles &&
                                    rule.exempt_roles.length > 0
                                        ? rule.exempt_roles
                                              .map((roleId) => {
                                                  const role =
                                                      interaction.guild.roles.cache.get(
                                                          roleId
                                                      );
                                                  return role
                                                      ? role.name
                                                      : roleId;
                                              })
                                              .join(", ")
                                        : [
                                              "No hay roles exentos de esta regla.",
                                          ];

                                const exemptChannels =
                                    rule.exempt_channels &&
                                    rule.exempt_channels.length > 0
                                        ? rule.exempt_channels
                                              .map((channelId) => {
                                                  const channel =
                                                      interaction.guild.channels.cache.get(
                                                          channelId
                                                      );
                                                  return channel
                                                      ? channel.name
                                                      : channelId;
                                              })
                                              .join(", ")
                                        : [
                                              "No hay canales exentos de esta regla.",
                                          ];

                                const ruleInfo = [
                                    `**ID:** ${rule.id}`,
                                    `**Creador:** <@${rule.creator_id}>`,
                                    `**Acciones:** ${rule.actions
                                        .map(
                                            (action) => actionTypes[action.type]
                                        )
                                        .join(", ")}`,
                                    `**Roles exentos:** ${exemptRoles} `,
                                    `**Canales exentos:** ${exemptChannels} `,
                                    `**Estado:** ${
                                        rule.enabled
                                            ? "Habilitado"
                                            : "Deshabilitado"
                                    }`,
                                ].join("\n");

                                embed.addFields({
                                    name: `> ${rule.name}`,
                                    value: `${ruleInfo}`,
                                });

                                cmpAutomod.components[0].addOptions({
                                    label: `${rule.name}`,
                                    description: `${rule.actions
                                        .map(
                                            (action) => actionTypes[action.type]
                                        )
                                        .join(", ")}`,
                                    value: rule.id,
                                });
                            });

                            const replieAuto = await interaction.reply({
                                embeds: [embed],
                                components: [cmpAutomod, buttonAyuda],
                            });

                            const filtro = (i) => i.customId === "MenuRules";
                            const collector =
                                replieAuto.createMessageComponentCollector({
                                    componentType: ComponentType.StringSelect,
                                    filter: filtro,
                                });

                            collector.on("collect", async (i) => {
                                if (!i.isStringSelectMenu()) return;

                                const idReglaSeleccionada = i.values[0];

                                if (idReglaSeleccionada === "PrincipalRules") {
                                    await i.update({
                                        embeds: [embed],
                                        components: [cmpAutomod, buttonAyuda],
                                    });
                                } else {
                                    const btnDelRule =
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setCustomId(`cancelHelp`)
                                                .setStyle(ButtonStyle.Danger)
                                                .setEmoji(emojiId),

                                            new ButtonBuilder()
                                                .setCustomId(
                                                    `deleteRule_${idReglaSeleccionada}`
                                                )
                                                .setLabel("Eliminar regla")
                                                .setStyle(ButtonStyle.Danger)
                                        );

                                    // Obtener los detalles de la regla
                                    const ruleResponse = await axios.get(
                                        `https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules/${idReglaSeleccionada}`,
                                        {
                                            headers: {
                                                Authorization: `Bot ${interaction.client.token}`,
                                            },
                                        }
                                    );
                                    const ruleName = ruleResponse.data.name;

                                    const exemptRoles =
                                        ruleResponse.data.exempt_roles &&
                                        ruleResponse.data.exempt_roles.length >
                                            0
                                            ? ruleResponse.data.exempt_roles
                                                  .map((roleId) => {
                                                      const role =
                                                          interaction.guild.roles.cache.get(
                                                              roleId
                                                          );
                                                      return role
                                                          ? role.name
                                                          : roleId;
                                                  })
                                                  .join(", ")
                                            : "No hay roles exentos de esta regla.";

                                    const exemptChannels =
                                        ruleResponse.data.exempt_channels &&
                                        ruleResponse.data.exempt_channels
                                            .length > 0
                                            ? ruleResponse.data.exempt_channels
                                                  .map((channelId) => {
                                                      const channel =
                                                          interaction.guild.channels.cache.get(
                                                              channelId
                                                          );
                                                      return channel
                                                          ? channel.name
                                                          : channelId;
                                                  })
                                                  .join(", ")
                                            : "No hay canales exentos de esta regla.";

                                    const ruleData = [
                                        `**ID:** ${ruleResponse.data.id}`,
                                        `**Creador:** <@${ruleResponse.data.creator_id}>`,
                                        `**Acciones:** ${ruleResponse.data.actions
                                            .map(
                                                (actions) =>
                                                    actionTypes[actions.type]
                                            )
                                            .join(", ")}`,
                                        `**Roles exentos:** ${exemptRoles}`,
                                        `**Canales exentos:** ${exemptChannels}`,
                                        `**Estado:** ${
                                            ruleResponse.data.enabled
                                                ? "Habilitado"
                                                : "Deshabilitado"
                                        }`,
                                    ].join("\n");

                                    const embedRule = new EmbedBuilder()
                                        .setTitle(`${ruleName}`)
                                        .setColor("e7453c")
                                        .setDescription(`${ruleData}`);

                                    await i
                                        .update({
                                            embeds: [embedRule],
                                            components: [
                                                cmpAutomod,
                                                btnDelRule,
                                            ],
                                        })
                                        .catch((error) => {
                                            if (error) {
                                                return;
                                            }
                                        });
                                }
                            });
                        }
                    } catch (error) {
                        console.log(error);
                        const embed = new EmbedBuilder()
                            .setTitle("❌ | Error")
                            .setDescription(
                                `Error al obtener las reglas de AutoMod\n${error}`
                            )
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}Ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });

                        interaction.reply({ embeds: [embed] });
                    }
                    break;

                case "eliminar":
                    try {
                        const guildId = interaction.guild.id;
                        const ruleId = interaction.options.getString("regla");

                        // Obtener los detalles de la regla
                        const ruleResponse = await axios.get(
                            `https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
                            {
                                headers: {
                                    Authorization: `Bot ${interaction.client.token}`,
                                },
                            }
                        );

                        const ruleName = ruleResponse.data.name;

                        if (await ruleName.startsWith("Anti Spam by:")) {
                            await spamDetection.findOneAndDelete({
                                guildId: interaction.guild.id,
                            });
                        }

                        // Eliminar la regla
                        const response = await axios.delete(
                            `https://discord.com/api/v9/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
                            {
                                headers: {
                                    Authorization: `Bot ${interaction.client.token}`,
                                },
                            }
                        );

                        if (response.status === 204) {
                            const embed = new EmbedBuilder()
                                .setTitle("Regla eliminada correctamente.")
                                .setDescription(
                                    `Se eliminó la regla de AutoMod "**${ruleName}**" con ID: **${ruleId}**`
                                )
                                .setColor("#00ff00")
                                .setTimestamp()
                                .setFooter({
                                    text: `${client.user.tag} || ${client.ws.ping}ms`,
                                    iconURL: client.user.displayAvatarURL(),
                                });

                            await interaction.reply({ embeds: [embed] });
                        } else {
                            const embed = new EmbedBuilder()
                                .setTitle("❌ | Error")
                                .setDescription(
                                    "Ocurrió un error al eliminar la regla de AutoMod"
                                )
                                .setColor("#ff0000");

                            await interaction.reply({ embeds: [embed] });
                        }
                    } catch (error) {
                        const embed = new EmbedBuilder()
                            .setTitle("❌ | Error")
                            .setDescription(
                                `Ocurrió un error con la regla de AutoMod seleccionada.\n\nEs posible que esta regla no pueda ser eliminada pues algunos servidores con el ajuste de comunidad activo tienen esta regla predeterminada.\n${error}`
                            )
                            .setColor("#ff0000")
                            .setFooter({
                                text: `${client.user.tag} || ${client.ws.ping}Ms`,
                                iconURL: client.user.displayAvatarURL(),
                            });

                        await interaction.reply({ embeds: [embed] });
                    }
                    break;
            }
        } catch (error) {
            console.log(error);
            await interaction.reply(
                `No tengo permisos para lanzar mi sistema de AutoMod en este servidor :c\n${error}`
            );
        }
    },
};
