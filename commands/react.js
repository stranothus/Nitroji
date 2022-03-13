 // import package
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    // setup the slash command format 
    data: new SlashCommandBuilder()
        .setName("react")
        .setDescription("Make me react to a message with an emoji")
			.addStringOption(option => option
				.setName("emoji")
				.setDescription("The emoji to react with from your saved emoji list")
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName("message")
				.setDescription("The id of the message to react to")
				.setRequired(true)
			)
			.addChannelOption(option => option
				.setName("channel")
				.setDescription("The channel the message is in")
				.setRequired(false)
			),
    // let it be used in DMs
    DMs: false,
    // execute for slash commands
    execute: async function(interaction) {
        const emojiName = interaction.options.getString("emoji").toLowerCase();
		const messageId = interaction.options.getString("message");
		const channel = interaction.options.getChannel("channel") || interaction.channel;
        const emojiExists = await db.db("Users").collection("emojis").findOne({ user: interaction.member.id, emojis: { $elemMatch: { name: emojiName }}});

        if(!emojiExists) {
            await interaction.reply({
                content: `No saved emoji by name ${emojiName} found`,
                ephemeral: true
            });

            return;
        }

        const emojiId = emojiExists.emojis.filter(v => v.name === emojiName)[0].id;
		const message = await channel.messages.fetch(messageId);

        if(!message || message.size) {
            await interaction.reply({
                content: `No message found`,
                ephemeral: true
            });

            return;
        }

		const reaction = await message.react(emojiId);
		await interaction.reply({
			content: `Reacted! Click the reaction to add your own. I'll remove mine in a few seconds`,
			ephemeral: true
		});

		setTimeout(() => reaction.users.remove(interaction.client.id), 1000 * 5);
    },
    // execute for text commands
    executeText: async function(msg, args) {
        const emojiName = args[0].toLowerCase();

		if(!emojiName) {
			await msg.reply({
				content: "No emoji name inputted"
			});

			return;
		}
		
		const messageId = args[1] || msg?.reference?.messageId;

		if(!messageId) {
			await msg.reply({
				content: "No message id inputted"
			});

			return;
		}
		
		const channelId = msg?.reference?.messageId ? args[1] : args[2];
		const channel = channelId ? msg.guild.channels.get(channelId) : msg.channel;

		if(!channel) {
			await msg.reply({
				content: "No channel found"
			});

			return;
		}
		
        const emojiExists = await db.db("Users").collection("emojis").findOne({ user: msg.author.id, emojis: { $elemMatch: { name: emojiName }}});

        if(!emojiExists) {
            await msg.reply({
                content: `No saved emoji by name ${emojiName} found`,
                ephemeral: true
            });

            return;
        }

        const emojiId = emojiExists.emojis.filter(v => v.name === emojiName)[0].id;
		const message = await channel.messages.fetch(messageId);

        if(!message || message.size) {
            await interaction.reply({
                content: `No message found`,
                ephemeral: true
            });

            return;
        }

		const reaction = await message.react(emojiId);
		await msg.reply({
			content: `Reacted! Click the reaction to add your own. I'll remove mine in a few seconds`
		});

		setTimeout(() => reaction.users.remove(msg.client.id), 1000 * 5);
    }
}