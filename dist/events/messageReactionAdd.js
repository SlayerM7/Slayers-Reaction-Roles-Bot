"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = (client, db, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.partial)
        yield reaction.fetch();
    const { message } = reaction;
    const { guild } = message;
    if (user.id === client.user.id)
        return;
    if (db.has(`reaction_roles_${guild.id}`)) {
        let data = db.get(`reaction_roles_${guild.id}`);
        data.roles.forEach((obj) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data.messageID)
                return console.log("remove none");
            if (message.id !== data["messageID"])
                return console.log(`remove not === `);
            if (obj["id"] === reaction.emoji.id) {
                let member = yield guild.members.fetch(user.id);
                member.roles.add(obj["role"].id).then(() => {
                    user.send(new discord_js_1.MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`You have recieved the ${obj["role"].name} role`)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setTimestamp());
                });
            }
        }));
    }
});
