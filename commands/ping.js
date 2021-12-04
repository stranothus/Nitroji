import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),
    execute: function(interaction) {
        interaction.reply("Pong!");
    },
    executeText: function(msg, args) {
        msg.channel.send("Pong!");
    }
}