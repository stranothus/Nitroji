import permissions from "../utils/permissions.js";

// setup the on interactionCreate event
export default {
    type: "on",
    name: "interactionCreate",
    execute: interaction => {
        if(!permissions(interaction.guild.me.permissions)) return;

        // only run for commands
        if (!interaction.isCommand()) return;
        
        // find the command
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;
        
        // run the command, checking if it's available in DMs
        try {
            if(!command.DMs && !interaction.guild) {
                interaction.reply("This command is not intended for direct message use :(");
                return;
            }
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};