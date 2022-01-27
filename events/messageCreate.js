import dirFlat from "../utils/dirFlat.js";

const prefix = "!";

const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

export default {
    type: "on",
    name: "messageCreate",
    execute: async msg => {
        if(msg.author.bot) return;
        if(!msg.guild) {
            if(msg.author.bot) return;
            var args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            var command = args[0].toLowerCase();
            args.splice(0, 1);

            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            if(!index.DMs) {
                msg.channel.send("This command cannot be used outside of servers :(");
                return;
            }

            index.executeText(msg, args);
        } else {
			if(msg.content.startsWith(prefix)) {
				msg.content = msg.content.replace(new RegExp("^" + prefix), "");
			} else if(msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
				msg.content = msg.content.replace(new RegExp(`^<@!${msg.client.user.id}>\\s*`), "");
			} else {
				return;
			}
            var args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            var command = args[0].toLowerCase();
            args.splice(0, 1);

            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            index.executeText(msg, args);
        }
    }
}
