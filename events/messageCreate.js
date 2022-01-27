 // import packages
 import dirFlat from "../utils/dirFlat.js";

 // the default prefix
const prefix = "!";

 // load commands
const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("../" + v);

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
            var args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            var command = args[0].toLowerCase();
            args.splice(0, 1);

            // find the command
            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            // run the command if it is set to be available in DMs
            if(!index.DMs) {
                msg.channel.send("This command cannot be used outside of servers :(");
                return;
            }

            index.executeText(msg, args);
        } else {
            // check if the message is prefixed with the prefix or a bot ping
			if(msg.content.startsWith(prefix)) {
				msg.content = msg.content.replace(new RegExp("^" + prefix), "");
			} else if(msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
				msg.content = msg.content.replace(new RegExp(`^<@!${msg.client.user.id}>\\s*`), "");
			} else {
				return;
			}

            //  parse arguments
            var args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
            var command = args[0].toLowerCase();
            args.splice(0, 1);

            // find and execute the command
            let index = (await commands).findIndex(v => v.data.name === command);
                index = (await commands)[index];

            index.executeText(msg, args);
        }
    }
}
