import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

 export default {
    data: new SlashCommandBuilder()
        .setName("showemojis")
        .setDescription("Show all of your saved emojis"),
    DMs: true,
    execute: async function(interaction) {
        const user = await db.db("Users").collection("emojis").findOne({ user: interaction.member.id });

        if(!user || !user.emojis) {
            interaction.reply({
                content: `No saved emojis`,
                ephemeral: true
            });
        }

        const emojis = (await Promise.all(user.emojis.map(async v => ({
            ...v,
            object: await interaction.client.emojis.cache.get(v.id)
        })))).filter(v => v.object && v.object.id);

        const embed = new MessageEmbed()
            .setTitle("Your emojis")
            .setDescription(emojis.map(v => `${v.name}: <${v.object.animated ? "a" : ""}:${v.object.name}:${v.object.id}>`).join("\n"));

        interaction.reply({
            embeds: [ embed ],
            ephemeral: true
        });
    },
    executeText: async function(msg, args) {
        const user = await db.db("Users").collection("emojis").findOne({ user: msg.member.id });

        if(!user || !user.emojis) {
            msg.reply({
                content: `No saved emojis`
            });
        }

        const emojis = (await Promise.all(user.emojis.map(async v => ({
            ...v,
            object: await msg.client.emojis.cache.get(v.id)
        })))).filter(v => v.object && v.object.id);

        const embed = new MessageEmbed()
            .setTitle("Your emojis")
            .setDescription(emojis.map(v => `${v.name}: <${v.object.animated ? "a" : ""}:${v.object.name}:${v.object.id}>`).join("\n"));

        msg.reply({
            embeds: [ embed ]
        });
    }
}