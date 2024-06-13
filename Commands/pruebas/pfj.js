const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');

module.exports = {
    execute : "",
    category: 'member',
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Mira tu perfil o el de otro usuario")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("usuario")
      .setDescription("Información del usuario")
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const memberOption = interaction.options.getMember("usuario");
    const member = memberOption || interaction.member;

    if (member.user.bot) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription("El bot no puede proporcionar el perfil de otra aplicación.").setColor('Aqua')
        ],
        ephemeral: true
      });
    }

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

      const joinPosition = Array.from(fetchedMembers
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .keys())
        .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince ? "<:discordboost7:1236777607035486332>" : "✖";

      const avatarButton = new ButtonBuilder()
        .setLabel('Avatar')
        .setStyle(5)
        .setURL(member.displayAvatarURL());

      const bannerButton = new ButtonBuilder()
        .setLabel('Banner')
        .setStyle(5)
        .setURL((await member.user.fetch()).bannerURL() || 'https://example.com/default-banner.jpg');

      const row = new ActionRowBuilder()
        .addComponents(avatarButton, bannerButton);

      const Embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.tag} | Información General`, iconURL: member.displayAvatarURL() })
        .setColor('Aqua')
        .setDescription(`El <t:${joinTime}:D>, ${member.user.username} fue el **${addSuffix(joinPosition)}** miembro en unirse al servidor.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: "Insignias", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: "Booster", value: `${Booster}`, inline: true },
          { name: "Roles", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: "Creado", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Se unió", value: `<t:${joinTime}:R>`, inline: true },
          { name: "UserId", value: `${member.id}`, inline: false },
        ]);

      interaction.editReply({ embeds: [Embed], components: [row], files: [imageAttachment] });

    } catch (error) {
      interaction.editReply({ content: "Un error en el código" });
      throw error;
    }
  }
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

  switch (number % 10) {
    case 1: return number + "st";
    case 2: return number + "nd";
    case 3: return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    "ActiveDeveloper": "<:activedeveloper:1236777467809890466> ",
    "BugHunterLevel1": " <:discordbughunter1:1236777720705449994> ",
    "BugHunterLevel2": "<:discordbughunter2:1236777755111198803> ",
    "PremiumEarlySupporter": "<:discordearlysupporter:1236777787415592980> ",
    "Partner": "<:discordpartner:1236777977942118501> ",
    "Staff": "<:discordstaff:1236778012733603970> ",
    "HypeSquadOnlineHouse1": "<:hypesquadbravery:1236778087874691192> ", // bravery
    "HypeSquadOnlineHouse2": "<:hypesquadbrilliance:1236778121219539035> ", // brilliance
    "HypeSquadOnlineHouse3": "<:hypesquadbalance:1236778048544575611> ", // balance
    "Hypesquad": "<:hypesquadevents:1236778167172333629> ",
    "CertifiedModerator": "<:discordstaff:1236778012733603970>",
    "VerifiedDeveloper": "<:discordbotdev:1236777554883514430> ",
  };

  return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}
