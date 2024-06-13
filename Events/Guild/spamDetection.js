const { EmbedBuilder } = require("discord.js");
const { prefix } = require("../../Schemas/configGuilds"); // REEMPLAZA ESTA LINEA POR LA RUTA DONDE SE ALMACENA TU PREFIX

const messageMap = new Map();

function handleSpamDetection(message, maxDuplicates = 5) {
	if (message.author.bot) return;

	const userId = message.author.id;
	const content = message.content;
	const guildId = message.guild.id;

	// Verificar si el contenido del mensaje es una imagen o emoji
	if (
		message.attachments.size > 0 || // Verificar si hay archivos adjuntos (imágenes, etc.)
		message.content.match(/<a?:\w+:\d+>/g) || // Verificar si hay emojis personalizados
		message.content.match(/<:.+:\d+>/g) // Verificar si hay emojis normales
	) {
		return; // omite las imagenes y emojis
	}

	if (content.startsWith(prefix) && !message.author.bot) {
		return;
	}

	const mapKey = `${userId}-${guildId}-${content}`;

	if (messageMap.has(mapKey)) {
		const duplicateCount = messageMap.get(mapKey);
		if (duplicateCount >= maxDuplicates) {
			const embed = new EmbedBuilder()
				.setColor('Red')
				.setTitle("❗ Advertencia ❗")
				.setFields({
					name: `Advertencia del servidor **${message.guild.name}**`,
					value: `> No envíes el mismo mensaje más de ${maxDuplicates} veces, podrías ser sancionado.`,
				})
				.setTimestamp()
				.setFooter({
					text: `${message.client.user.tag} || ${message.client.ws.ping}Ms`,
					iconURL: message.client.user.displayAvatarURL(),
				});

			try {
				message.delete();
			} catch (error) {
				return;
			}
			try {
				message.author.send({ embeds: [embed] }).catch(console.error);
			} catch (error) {
				return;
			}
		} else {
			try {
				messageMap.set(mapKey, duplicateCount + 1);
			} catch (error) {
				return;
			}
		}
	} else {
		messageMap.set(mapKey, 1);

		setTimeout(() => {
			if (messageMap.has(mapKey)) {
				try {
					messageMap.delete(mapKey);
				} catch (error) {
					return;
				}
			}
		}, 5 * 60 * 1000);
	}
}

module.exports = { handleSpamDetection };