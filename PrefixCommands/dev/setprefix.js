const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const guildSchema = require('../../Schemas/configGuilds');

module.exports = {
	name: "setprefix",
	description: "Cambia mi prefix en este servidor.",
	alias: ["spx"],
	usage: `setprefix <nuevo prefix>`,
	category: "admin",

	async execute(message, args, client, prefix, lang) {

		if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return message.reply({ embeds: [ new EmbedBuilder().setColor('Red').setDescription(client.languages.__({ phrase: 'prefix.noPerms', locale: lang })) ] }).then((msg) => { setTimeout(() => msg.delete(), 8000); });
		}

		const newPrefix = args[0];
		console.log(newPrefix)

		if (!newPrefix) {
			const embedNoArg = new EmbedBuilder()
				.setDescription(client.languages.__({ phrase: 'prefix.noArgs', locale: lang }))
				.setColor("#2f3136")
			
			return message.reply({ embeds: [embedNoArg]}).then((msg) => { setTimeout(() => msg.delete(), 8000); });
		}

		if (newPrefix.length > 3 || newPrefix.length < 1) {
			const embedMaxArg = new EmbedBuilder()
				.setDescription(client.languages.__({ phrase: 'prefix.noValid', locale: lang }))
				.setColor("#2f3136")
			return message.channel.send({ embeds: [embedMaxArg] }).then((msg) => { setTimeout(() => msg.delete(), 8000) });
		}

		try {
			const data = await guildSchema.findOne({ GuildId: message.guild.id });

			if (data) {
				(data.GuildPrefix = newPrefix),
				data.save();
			} else {
				new guildSchema({ GuildId: message.guild.id, GuildPrefix: newPrefix }).save();
			}

			const embed = new EmbedBuilder()
                .setDescription(client.languages.__mf({ phrase: 'prefix.success', locale: lang }, { newPrefix: newPrefix }))
                .setColor("#2f3136")

			await message.reply({ embeds: [embed] });
		} catch (err) {
			console.log(err)
			message.reply({ content: `Ocurrio un error al intentar actualizar el prefix\n` + err });
		}
	},
};


