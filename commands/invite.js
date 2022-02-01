 // import package
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    // setup the slash command format 
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite me to your server!"),
    // let it be used in DMs
    DMs: true,
    // execute for slash commands
    execute: function(interaction) {
        interaction.reply("https://discord.com/api/oauth2/authorize?client_id=936076862797520956&permissions=275415050240&scope=bot%20applications.commands");
    },
    // execute for text commands
    executeText: function(msg, args) {
        msg.channel.send("https://discord.com/api/oauth2/authorize?client_id=936076862797520956&permissions=275415050240&scope=bot%20applications.commands")
    }
}