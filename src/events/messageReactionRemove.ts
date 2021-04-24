import { MessageEmbed } from "discord.js";

module.exports = async (client, db, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  const { message } = reaction;
  const { guild } = message;
  if (user.id === client.user.id) return;
  if (db.has(`reaction_roles_${guild.id}`)) {
    let data = db.get(`reaction_roles_${guild.id}`);
    data.roles.forEach(async (obj) => {
      if (!data.messageID) return console.log("remove none");
      if (message.id !== data["messageID"])
        return console.log(`remove not === `);
      if (obj["id"] === reaction.emoji.id) {
        let member = await guild.members.fetch(user.id);
        member.roles.remove(obj["role"].id).then(() => {
          user.send(
            new MessageEmbed()
              .setColor("BLUE")
              .setAuthor(
                user.username,
                user.displayAvatarURL({ dynamic: true })
              )
              .setDescription(`You have lost the ${obj["role"].name} role`)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setTimestamp()
          );
        });
      }
    });
  }
};
