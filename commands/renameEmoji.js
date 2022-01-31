import { SlashCommandBuilder } from "@discordjs/builders";

 export default {
    data: new SlashCommandBuilder()
        .setName("renameemoji")
        .setDescription("Rename an emoji from your saved list")
        .addStringOption(option => option
            .setName("old")
            .setDescription("The old name of the saved emoji to rename")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("new")
            .setDescription("The new name for the emoji")
            .setRequired(true)
        ),
    DMs: true,
    execute: async function(interaction) {
        const emoji = interaction.options.getString("old").trim();
        const name = interaction.options.getString("new").trim();
        const emojisColl = await db.db("Users").collection("emojis");
        const emojiExists = await emojisColl.findOne({ user: interaction.member.id, emojis: { $elemMatch: { name: emoji }}});

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

        await emojisColl.updateOne({ user: interaction.member.id }, { $pull: { emojis: { id: emojiObject.id }}});
        await emojisColl.updateOne({ user: interaction.member.id }, { $push: { emojis: { 
            id: emojiObject.id,
            name: name
        }}});

        interaction.reply({
            content: `Renamed <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}> from ${emoji} to ${name}`,
            ephemeral: true
        });
    },
    executeText: async function(msg, args) {
        const emoji = args[0];
        const name = args[1];

        if(!emoji || !name) {
            msg.reply({
                content: "Please input an old emoji name and a new emoji name!"
            });

            return;
        }

        const emojisColl = await db.db("Users").collection("emojis");
        const emojiExists = await emojisColl.findOne({ user: msg.member.id, emojis: { $elemMatch: { name: emoji }}});

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

        await emojisColl.updateOne({ user: msg.member.id }, { $pull: { emojis: { id: emojiObject.id }}});
        await emojisColl.updateOne({ user: msg.member.id }, { $push: { emojis: { 
            id: emojiObject.id,
            name: name
        }}});

        msg.reply({
            content: `Renamed <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}> from ${emoji} to ${name}`
        });
    }
}