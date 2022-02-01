import { SlashCommandBuilder } from "@discordjs/builders";

 export default {
    data: new SlashCommandBuilder()
        .setName("saveemoji")
        .setDescription("Saves an emoji")
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("The emoji from this server to save")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name to save the emoji as")
            .setRequired(true)
        ),
    DMs: false,
    execute: async function(interaction) {
        const emoji = interaction.options.getString("emoji").trim();
        const name = interaction.options.getString("name").trim();

        if(!emoji.match(/:[^\s]+:\d{18}/)) {
            interaction.reply({
                content: "Please input a valid server emoji!",
                ephemeral: true
            });

            return;
        }

        const emojiObject = await interaction.client.emojis.cache.get(emoji.match(/\d{18}/).reverse()[0]);

        if(!emojiObject || !emojiObject.id) {
            interaction.reply({
                content: "Something went wrong! Make sure you're inputting a valid emoji from a server I'm in",
                ephemeral: true
            });

            return;
        }

        const emojisColl = await db.db("Users").collection("emojis");
        const documentExists = await emojisColl.findOne({ user: interaction.member.id });
        const emojiExists = await emojisColl.findOne({ user: interaction.member.id, emojis: { $elemMatch: { $or: [{ id: emojiObject.id }, { name: name }]}}});

        if(documentExists) {
            if(emojiExists) {
                interaction.reply({
                    content: "Looks like you already have that emoji or another emoji by the same name saved!",
                    ephemeral: true
                });
    
                return;
            }

            await emojisColl.updateOne({ user: interaction.member.id }, { $push: { emojis: { 
                id: emojiObject.id,
                name: name
            }}});
        } else {
            await emojisColl.insertOne({
                user: interaction.member.id,
                emojis: [
                    {
                        id: emojiObject.id,
                        name: name
                    }
                ]
            });
        }

        interaction.reply({
            content: `You saved <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}>! Access it through servers I'm in with \`{${name}}\` in your message`,
            ephemeral: true
        });
    },
    executeText: async function(msg, args) {
        const emoji = args[0];
        const name = args[1];

        if(!emoji || !name) {
            msg.reply({
                content: "Please input an emoji and a name!"
            });

            return;
        }

        if(!emoji.match(/:[^\s]+:\d{18}/)) {
            msg.reply({
                content: "Please input a valid server emoji!"
            });

            return;
        }

        const emojiObject = await msg.guild.emojis.cache.get(emoji.match(/\d{18}/).reverse()[0]);

        if(!emojiObject || !emojiObject.id) {
            msg.reply({
                content: "Something went wrong! Make sure you're inputting a valid emoji from a server I'm in"
            });

            return;
        }

        const emojisColl = await db.db("Users").collection("emojis");
        const documentExists = await emojisColl.findOne({ user: msg.member.id });
        const emojiExists = await emojisColl.findOne({ user: msg.member.id, emojis: { $elemMatch: { $or: [{ id: emojiObject.id }, { name: name }]}}});

        if(documentExists) {
            if(emojiExists) {
                msg.reply({
                    content: "Looks like you already have that emoji or another emoji by the same name saved!"
                });
    
                return;
            }

            await emojisColl.updateOne({ user: msg.member.id }, { $push: { emojis: { 
                id: emojiObject.id,
                name: name
            }}});
        } else {
            await emojisColl.insertOne({
                user: msg.member.id,
                emojis: [
                    {
                        id: emojiObject.id,
                        name: name
                    }
                ]
            });
        }

        msg.reply({
            content: `You saved <${emojiObject.animated ? "a" : ""}:${emojiObject.name}:${emojiObject.id}>! Access it through servers I'm in with \`{${name}}\` in your message`
        });
    }
}