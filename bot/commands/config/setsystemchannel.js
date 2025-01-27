const Command = require("@Command");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  name: "setsystemchannel",
  aliases: ["setsystemch"],
  args: "Provide a system channel to set as your server system channel.",
  userPermissions: ["ADMINISTRATOR"],
  async run(message, args) {
    const channel = message.mentions.channels.first();
    const ch = await client.channels.cache.get(channel.id);
    if (!ch)
      return message.channel.sendErrorReply(
        message,
        "Error!",
        "Invalid channel provided."
      );
    const Schema = client.schemas.guild;
    const guildSchema = client.db.guilds.cache.get(message.guild.id);
    const currentChannel = guildSchema.systemChannel;
    if (guildSchema.systemChannel) {
      const data = await Schema.findOneAndUpdate(
        {
          id: message.guild.id,
        },
        {
          systemChannel: ch.id,
        },
        {
          upsert: true,
        }
      );
      client.db.guilds.cache.set(message.guild.id, data);
      await message.channel.sendSuccessReply(
        message,
        "Success!",
        `Updated the system channel from ${currentChannel} => <#${ch.id}>!`
      );
    } else {
      await Schema.findOneAndUpdate(
        {
          id: message.guild.id,
        },
        {
          systemChannel: ch.id,
        },
        {
          upsert: true,
        }
      );
      await message.channel.sendSuccessReply(
        message,
        "Success!",
        `The system channel has been set to ${ch}`
      );
    }
  },
});
