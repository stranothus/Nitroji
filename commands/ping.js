 // import package
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    // setup the slash command format 
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),
    // let it be used in DMs
    DMs: true,
    // execute for slash commands
    execute: function(interaction) {
        interaction.reply("Pong!");
        interaction.fetchReply().then(reply => reply.channel.send("Latency is " + (reply.createdTimestamp - interaction.createdTimestamp) + "ms"));
    },
    // execute for text commands
    executeText: function(msg, args) {
        msg.channel.send("Pong!").then(reply => reply.channel.send("Latency is " + (reply.createdTimestamp - msg.createdTimestamp) + "ms"));
    }
}