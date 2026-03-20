const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  Interaction
} = require("discord.js");

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) {
    const targetUserId = interaction.options.get('target-user').value();
    const reason = interaction.options.get('reason')?.value() || "No reason provided.";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this guild?");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("This user is the owner of this guild.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can not ban a higher rank than yourself ):");
      return;
    }
  },

  name: "ban",
  description: "Bans a member from the server.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for banning.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.Administrator],
};
