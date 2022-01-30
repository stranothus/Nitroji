import { SlashCommandBuilder } from "@discordjs/builders";

 export default {
    data: new SlashCommandBuilder()
        .setName("removeemoji")
        .setDescription("Remove an emoji from your saved list")
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("The name of the saved emoji to remove")
            .setRequired(true)
        ),
    DMs: true,
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
                content: `Emoji deleted.`,
                ephemeral: true
            });

            return;
        }

        await db.db("Users").collection("emojis").updateOne({ user: interaction.member.id }, { $pull: { emojis: { id: emojiObject.id }}});

        interaction.reply({
            content: `Deleted <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}> from your saved emojis`,
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
                content: `Emoji deleted.`
            });

            return;
        }

        await db.db("Users").collection("emojis").updateOne({ user: msg.member.id }, { $pull: { emojis: { id: emojiObject.id }}});

        msg.reply({
            content: `Deleted <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}> from your saved emojis`
        });
    }
}