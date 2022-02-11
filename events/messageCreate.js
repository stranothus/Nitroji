 // import packages
import dirFlat from "../utils/dirFlat.js";
import asyncReplace from "../utils/asyncReplace.js";
import asUser from "../utils/asUser.js";
import permissions from "../utils/permissions.js";

 // the default prefix
const prefix = "!";

 // load commands
const commands = Promise.all(dirFlat("./commands").map(async v => {
    const imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

 // setup the on messageCreate event
export default {
    type: "on",
    name: "messageCreate",
    execute: async msg => {
        // don't do anything for bots
        if(msg.author.bot) return;
        // if it's in direct messages
        if(!msg.guild) {
            // parse arguments
            let args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            const command = args[0].toLowerCase();
            args.splice(0, 1);

            // find the command
            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            // run the command if it is set to be available in DMs
            if(!index.DMs) {
                msg.channel.send("This command cannot be used outside of servers :(");
                return;
            }

            if(!index) return;

            index.executeText(msg, args);
        } else {
            if(!permissions(msg.guild.me.permissions)) return;

            // check if the message is prefixed with the prefix or a bot ping
			if(msg.content.startsWith(prefix)) {
				msg.content = msg.content.replace(new RegExp("^" + prefix), "");
			} else if(msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
				msg.content = msg.content.replace(new RegExp(`^<@!${msg.client.user.id}>\\s*`), "");
			} else {
                if(!msg.content.match(/{[^\s!]+}/)) return;

                const user = await db.db("Users").collection("emojis").findOne({ user: msg.member.id });
				if(!user) return;
				const emojis = user.emojis;
                const content = await asyncReplace(msg.content, /{([^\s!]+)}/g, async $1 => {
                    const text = $1.slice(1, -1);

                    const emoji = emojis.filter(v => v.name.includes(text))[0];

                    if(!emoji || !emoji.id) return $1;

                    const emojiObject = await msg.client.emojis.cache.get(emoji.id);

                    if(!emojiObject || !emojiObject.id) return $1;

                    return `<${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}>`;
                });

                if(content === msg.content) return;

                setTimeout(() => {
                    if(!msg.channel.messages.resolveId(msg.id)) return;

                    msg.delete();

                    asUser(msg.channel, msg.member, content, msg.attachments);
                });

				return;
			}

            //  parse arguments
            let args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            const command = args[0].toLowerCase();
            args.splice(0, 1);

            // find and execute the command
            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            if(!index) return;

            index.executeText(msg, args);
        }
    }
}
