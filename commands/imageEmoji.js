import { SlashCommandBuilder } from "@discordjs/builders";

 export default {
    data: new SlashCommandBuilder()
        .setName("imageemoji")
        .setDescription("Get the image version of an emoji from your saved list")
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("The name of your saved emoji to display")
            .setRequired(true)
        ),
    DMs: false,
    execute: async function(interaction) {
        const emoji = interaction.options.getString("emoji").trim();
        const emojiExists = await db.db("Users").collection("emojis").findOne({ user: interaction.member.id, emojis: { $elemMatch: { name: emoji }}});

        if(!emojiExists) {
            interaction.reply({
                content: `No saved emoji by name ${emoji} found`,
                ephemeral: true
            });

            return;
        }

        const emojiId = emojiExists.emojis.filter(v => v.name === emoji)[0].id;
        const emojiObject = await interaction.client.emojis.cache.get(emojiId);

        if(!emojiObject || !emojiObject.id) {
            interaction.reply({
                content: `Something went wrong.`,
                ephemeral: true
            });

            return;
        }

        interaction.reply({
            content: `Image for <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}>:`,
            files: [ emojiObject.url ],
            ephemeral: true
        });
    },
    executeText: async function(msg, args) {
        const emoji = args[0];

        if(!emoji) {
            msg.reply({
                content: "Please input a saved emoji name!"
            });

            return;
        }

        const emojiExists = await db.db("Users").collection("emojis").findOne({ user: msg.member.id, emojis: { $elemMatch: { name: emoji }}});

        if(!emojiExists) {
            msg.reply({
                content: `No saved emoji by name ${emoji} found`
            });

            return;
        }

        const emojiId = emojiExists.emojis.filter(v => v.name === emoji)[0].id;
        const emojiObject = await msg.client.emojis.cache.get(emojiId);

        if(!emojiObject || !emojiObject.id) {
            msg.reply({
                content: `Something went wrong.`
            });

            return;
        }

        interaction.reply({
            content: `Image for <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}>:`,
            files: [ emojiObject.url ]
        });
    }
}