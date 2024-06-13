const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const guildSchema = require('../../Schemas/configGuilds');

module.exports = {
	name: "messageCreate",

    /**
     * @param {ChatInputCommandInteraction} message 
     * @param {Client} client 
     */

	async execute(message, client) {
		if (message.author.bot || message.channel.isDMBased()) return;
		const guildData = await guildSchema.findOne({ GuildId: message.guild.id });
		
		let prefix = '.';
		if (typeof guildData?.GuildPrefix === 'string') {
			prefix = guildData.GuildPrefix;
		};

		const devsIDS = ['245339452464037888', '1031349215751839765']

		if (!message.content?.toLowerCase().startsWith(prefix.toLowerCase())) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();

		let cmdprefix = client.prefixCommands.get(command) || client.prefixCommands.find((c) => c.alias && c.alias.includes(command));

		if (cmdprefix) {

			const server = message.guild;
			if (guildData) {
				server.lang = guildData.GuildLanguage;
			} else {
				const newGuild = new guildSchema({
					GuildId: server.id.toString(),
					GuildLanguage: 'es_LA'
				});
				newGuild.save().catch(err => { console.log(err) });
			};

			if (cmdprefix.developer && !devsIDS.includes(message.author.id)) {
				return message.reply({
					content: `Este comando es exlusivo para mis desarrolladores.`,
					allowedMentions: { repliedUser: false },
				});
			};

			const lang = message.guild.lang;
			try {
				cmdprefix.execute(message, args, client, prefix.toLowerCase(), lang);
			} catch (error) {
				console.log(error)
			}
			const ch = await client.channels.fetch("1155316602032623637").catch((e) => {
				return;
			});
            
			if (ch) {
				const embed = new EmbedBuilder()
					.setTitle(`> Servidor: **${message.guild.name}**`)
					.setDescription(`> Cmd:\n${prefix}${command} ${args?.join(" ")}`)
					.setTimestamp()
					.setFooter({
						text: `User: ${message.author.username} / ${message.author.id}`,
						iconURL: message.guild.iconURL(),
					});
				ch.send({ embeds: [embed] });
			}
		}
	},
};
 

