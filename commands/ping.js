import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),
    DMs: true,
    execute: function(interaction) {
        interaction.reply("Pong!");
        interaction.fetchReply().then(reply => reply.channel.send("Latency is " + (reply.createdTimestamp - interaction.createdTimestamp) + "ms"));
    },
    executeText: function(msg, args) {
        msg.channel.send("Pong!").then(reply => reply.channel.send("Latency is " + (reply.createdTimestamp - msg.createdTimestamp) + "ms"));
    }
}