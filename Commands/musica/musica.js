const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} = require("@discordjs/voice");
const play = require("play-dl");

// Mapa para almacenar la información de reproducción de música por servidor
const musicDataMap = new Map();

module.exports = {
    category: 'funtions',
    mantenimiento: true,
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Reproduce música")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("play")
                .setDescription("Reproducir una canción")
                .addStringOption((option) =>
                    option
                        .setName("cancion")
                        .setDescription("URL o nombre de la canción")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("stop").setDescription("Detener la reproducción")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("skip")
                .setDescription("Saltar a la siguiente canción")
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const voiceChannel = await interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.followUp(
                "Debes estar en un canal de voz para reproducir música."
            );
        } else {
            const subCommand = interaction.options.getSubcommand();
            switch (subCommand) {
                case `play`:
                    {
                        const guildId = interaction.guild.id;
                        const musicData = getOrCreateMusicData(guildId);

                        const song = interaction.options.getString("cancion");
                        const ytInfo = await play.search(song, { limit: 1 });
                        const videoUrl = ytInfo[0].url;
                        const duration = ytInfo[0].durationInSec;
                        const thumbnail = ytInfo[0].thumbnails[0].url;
                        const requestedBy = interaction.user.username;
                        const playlistItem = {
                            videoUrl,
                            duration,
                            thumbnail,
                            requestedBy,
                        };
                        musicData.playlist.push(playlistItem);

                        if (
                            !musicData.isPlaying &&
                            musicData.playlist.length === 1
                        ) {
                            musicData.isPlaying = true;
                            await playNextSong(
                                voiceChannel,
                                interaction,
                                guildId
                            );
                        } else {
                            const embed = createPlaylistEmbed(
                                musicData.playlist
                            );

                            if (musicData.playlistMessage) {
                                await editPlaylistMessage(
                                    interaction,
                                    embed,
                                    guildId
                                );
                            } else {
                                await sendPlaylistMessage(
                                    interaction,
                                    embed,
                                    guildId
                                );
                            }
                        }
                    }
                    break;
                case `stop`:
                    {
                        const guildId = interaction.guild.id;
                        const musicData = getOrCreateMusicData(guildId);

                        if (!musicData.isPlaying) {
                            return interaction.followUp(
                                "No hay canciones reproduciéndose."
                            );
                        }

                        musicData.playlist.length = 0;
                        musicData.isPlaying = false;
                        musicData.playlistMessage = null;

                        if (musicData.connection) {
                            musicData.connection.destroy();
                            musicData.connection = null;
                        }

                        interaction.followUp("Reproducción detenida.");
                    }
                    break;
                case `skip`:
                    {
                        const guildId = interaction.guild.id;
                        const musicData = getOrCreateMusicData(guildId);

                        if (!musicData.isPlaying) {
                            return interaction.followUp(
                                "No hay canciones reproduciéndose."
                            );
                        }

                        if (musicData.playlist.length === 0) {
                            return interaction.followUp(
                                "No hay más canciones en la lista."
                            );
                        }

                        interaction.followUp("Canción saltada.");

                        if (musicData.connection) {
                            musicData.connection.destroy();
                            musicData.connection = null;
                        }

                        playNextSong(voiceChannel, interaction, guildId);
                    }
                    break;
            }
        }
    },
};

async function playNextSong(voiceChannel, interaction, guildId) {
    const musicData = getOrCreateMusicData(guildId);
    const nextSong = musicData.playlist.shift();

    if (nextSong) {
        musicData.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const ytInfo = await play.search(nextSong.videoUrl, { limit: 1 });
        const videoUrl = ytInfo[0].url;
        const duration = ytInfo[0].durationInSec;
        const thumbnail = ytInfo[0].thumbnails[0].url;
        const requestedBy = nextSong.requestedBy;
        const stream = await play.stream(nextSong.videoUrl);
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });
        const player = createAudioPlayer({
            behaviors: { noSubscriber: NoSubscriberBehavior.Play },
        });

        player.play(resource);
        musicData.connection.subscribe(player);

        const embed = createNowPlayingEmbed(
            ytInfo[0],
            videoUrl,
            duration,
            thumbnail,
            requestedBy,
            interaction
        );

        const channel = interaction.client.channels.cache.get(
            interaction.channelId
        );

        const sentMessage = await channel.send({ embeds: [embed] });
        interaction.followUp({
            content: "Canción reproducida correctamente",
            ephemeral: true,
        });

        // Borra el embed después de 20 segundos
        setTimeout(() => {
            sentMessage.delete().catch(console.error);
        }, 45000);

        player.on("idle", () => {
            if (musicData.playlist.length === 0) {
                musicData.isPlaying = false;
                musicData.playlistMessage = null;
                player.stop();

                if (musicData.connection) {
                    musicData.connection.destroy();
                    musicData.connection = null;
                }

                return;
            }

            playNextSong(voiceChannel, interaction, guildId);
        });
    }
}

function createNowPlayingEmbed(
    ytInfo,
    videoUrl,
    duration,
    thumbnail,
    requestedBy,
    interaction
) {
    const embed = new EmbedBuilder()
        .setTitle("Reproduciendo música")
        .setDescription(
            "**Recuerda que si pones otra canción la canción se cambiará automáticamente**"
        )
        .addFields(
            {
                name: "Canción",
                value: `[${ytInfo.title}](${videoUrl})`,
                inline: false,
            },
            { name: "Duración", value: formatDuration(duration), inline: true },
            { name: "Vistas", value: formatNumber(ytInfo.views), inline: true },
            { name: "Canal", value: ytInfo.channel.name, inline: true }
        )
        .setThumbnail(thumbnail)
        .setFooter({
            text: "Solicitado por " + requestedBy,
            iconURL: interaction.user.displayAvatarURL(),
        });

    return embed;
}

function createPlaylistEmbed(playlist) {
    const embed = new EmbedBuilder()
        .setTitle("Lista de reproducción")
        .setDescription("Canciones en cola:")
        .setThumbnail(playlist[0].thumbnail)
        .setFooter({
            text: `Total de canciones en cola: ${playlist.length}`,
        });

    playlist.forEach((song, index) => {
        embed.addFields({
            name: `${index + 1}. ${song.videoUrl}`,
            value: `[Ver en YouTube](${song.videoUrl}) - Solicitado por ${song.requestedBy}`,
        });
    });

    return embed;
}

function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function editPlaylistMessage(interaction, embed, guildId) {
    const musicData = getOrCreateMusicData(guildId);
    const channel = interaction.client.channels.cache.get(
        interaction.channelId
    );

    try {
        const message = await channel.messages.fetch(musicData.playlistMessage);
        await message.edit({ embeds: [embed] });
        interaction.followUp(`Lista actualizada`);
    } catch (error) {
        console.error(
            "Error al editar el mensaje de la lista de reproducción:",
            error
        );
    }
}

async function sendPlaylistMessage(interaction, embed, guildId) {
    const musicData = getOrCreateMusicData(guildId);
    const channel = interaction.client.channels.cache.get(
        interaction.channelId
    );

    try {
        const reply = await channel.send({ embeds: [embed] });
        interaction.followUp("Se han añadido las canciones a la lista");
        musicData.playlistMessage = reply.id;
    } catch (error) {
        console.error(
            "Error al enviar el mensaje de lista de reproducción:",
            error
        );
    }
}

function getOrCreateMusicData(guildId) {
    if (!musicDataMap.has(guildId)) {
        musicDataMap.set(guildId, {
            playlist: [],
            isPlaying: false,
            playlistMessage: null,
            connection: null,
        });
    }

    return musicDataMap.get(guildId);
}
