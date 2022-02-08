 // import package
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import dirFlat from "../utils/dirFlat.js";

const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("." + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

 export default {
     // setup the slash command format 
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Learn how to use me"),
     // let it be used in DMs
    DMs: true,
     // execute for slash commands
    execute: async function(interaction) {
        const embed = new MessageEmbed()
            .setTitle("Using Nitroji")
            .setAuthor({
                name: "Quinn Gibson",
                url: "https://github.com/stranothus",
                iconURL: "https://avatars.githubusercontent.com/u/83613280?v=4"
            })
            .setDescription(`Welcome to Nitroji! Nitroji is a single purpose Discord bot. It's purpose is to make server-specific and animated emojis normal only available to Nitro users available for all users! You can save and use emojis from any server with Nitroji easily.

            Nitroji uses Discord bot's ability to send emojis from other servers like Nitro users can and webhooks. Webhooks are like Discord bots but without the logic. They can be used to send simple messages with a namke and profile picture. A bot can send messages directly, or it can use webhooks instead. Nitroji uses webhooks with your name and profile picture to post emojis so it's nearly the exact same as if you had posted the emojis!

            How Nitroji works is you post your message with Nitro emojis in curly brackets {like this}. You can name the emojis whatever you want when you save them, but remember to use that same name when you use them! Nitroji watches for messages with these curly brackets and checks if you have a saved emoji by the name in the curly brackets. If you do, it waits a second to make sure your message isn't deleted by any censor bot your server have and, if not, deletes your message and reposts it through webhooks with the emojis added in!

            Use the commands below to start using Nitroji!`)
            .addFields((await commands).map(v => ({
                name: v.data.name,
                value: v.data.description
            })));
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    },
     // execute for text commands
    executeText: async function(msg, args) {
        const embed = new MessageEmbed()
            .setTitle("Using Nitroji")
            .setAuthor({
                name: "Quinn Gibson",
                url: "https://github.com/stranothus",
                iconURL: "https://avatars.githubusercontent.com/u/83613280?v=4"
            })
            .setDescription(`Welcome to Nitroji! Nitroji is a single purpose Discord bot. It's purpose is to make server-specific and animated emojis normal only available to Nitro users available for all users! You can save and use emojis from any server with Nitroji easily.

            Nitroji uses Discord bot's ability to send emojis from other servers like Nitro users can and webhooks. Webhooks are like Discord bots but without the logic. They can be used to send simple messages with a namke and profile picture. A bot can send messages directly, or it can use webhooks instead. Nitroji uses webhooks with your name and profile picture to post emojis so it's nearly the exact same as if you had posted the emojis!

            How Nitroji works is you post your message with Nitro emojis in curly brackets {like this}. You can name the emojis whatever you want when you save them, but remember to use that same name when you use them! Nitroji watches for messages with these curly brackets and checks if you have a saved emoji by the name in the curly brackets. If you do, it waits a second to make sure your message isn't deleted by any censor bot your server have and, if not, deletes your message and reposts it through webhooks with the emojis added in!
            
            Use the commands below to start using Nitroji!`)
            .addFields((await commands).map(v => ({
                name: v.data.name,
                value: v.data.description
            })));
        
        msg.reply({
            embeds: [embed]
        });
    }
};