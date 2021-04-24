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
const client = new discord_js_1.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const fs = require("fs");
const { slayersDB } = require("slayer.db");
const db = new slayersDB({
    saveReadable: true,
    saveInternal: {
        func: true,
        dir: "./database",
    },
});
client.on("ready", () => console.clear());
fs.readdir("./dist/events/", (err, files) => {
    files.forEach((file) => {
        let eventName = file.split(".")[0];
        client.on(eventName, require(`./events/${eventName}`).bind(null, client, db));
    });
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    let prefix = "!";
    if (message.author.bot)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "reaction-roles") {
        let func = args[0];
        if (!func)
            return message.channel.send("No operation type was given");
        if (func === "remove") {
            let name = args.join(" ");
            let data = db.get(`reaction_roles_${message.guild.id}.roles`);
            data.forEach((obj) => {
                if (obj["name"] === name) {
                    let inputArray = db.has(`reaction_roles_${message.guild.id}.roles`)
                        ? db.get(`reaction_roles_${message.guild.id}.roles`)
                        : null;
                    if (inputArray) {
                        inputArray.splice(inputArray.indexOf({ name: name }));
                        db.set(`reaction_roles_${message.guild.id}.roles`, [...inputArray]);
                    }
                }
            });
            db.save();
            message.reply("Removed!");
        }
        if (func === "list") {
            let str = "";
            let data = db.get(`reaction_roles_${message.guild.id}`);
            data.roles.forEach((obj) => {
                str += `\n${obj.emoji} - ${obj.name} - ${`<@&${obj["role"].id}>`}`;
            });
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("BLUE")
                .setDescription(str);
            message.channel.send(embed);
        }
        if (func === "add") {
            let role = message.mentions.roles.first();
            args.shift();
            let name = args.slice(1).join(" ");
            let emoji = args[0];
            if (name.includes("<@&")) {
                name = name.replace(/<@&.+>/g, "");
            }
            if (emoji.includes("<@&")) {
                emoji = emoji.replace(/<@&.+>/g, "");
            }
            let inputArray = db.has(`reaction_roles_${message.guild.id}.roles`)
                ? db.get(`reaction_roles_${message.guild.id}.roles`)
                : null;
            if (inputArray) {
                db.set(`reaction_roles_${message.guild.id}.roles`, [
                    ...inputArray,
                    {
                        name,
                        emoji,
                        role,
                    },
                ]);
            }
            else {
                db.set(`reaction_roles_${message.guild.id}.roles`, [
                    {
                        name,
                        emoji,
                        role,
                        id: discord_js_1.Util.parseEmoji(emoji).id,
                    },
                ]);
            }
            db.save();
            message.reply("Added!");
        }
    }
    if (command === "start") {
        let str = "";
        let data = db.get(`reaction_roles_${message.guild.id}.roles`);
        data.forEach((obj) => {
            str += `\n${obj.emoji} - ${obj.name}`;
        });
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("BLUE")
            .setDescription(str);
        let msg = yield message.channel.send(embed);
        db.set(`reaction_roles_${message.guild.id}.messageID`, msg.id);
        db.save();
        data.forEach((obj) => {
            msg.react(obj.emoji);
        });
    }
}));
client.login("ODE3ODQyMTM3MTEwNTQ0NDM0.YEPY2A.7M1ZKh71DcBi6MdmNBSDBdXWNr4");
