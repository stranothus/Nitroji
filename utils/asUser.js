import { Permissions } from "discord.js";

async function asUser(channel, author, content) {
    if(!(channel.guild || channel.parent.guild).me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return;
    
    if(channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD") {
        let webhook = (await channel.parent.fetchWebhooks()).filter(webhook => webhook.name === channel.client.user.tag).first() || await channel.parent.createWebhook(channel.client.user.tag);

        webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "threadId": channel.id
        });
    } else {
        let webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === channel.client.user.tag).first() || await channel.createWebhook(channel.client.user.tag);

        webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            }
        });
    }
}

export default asUser;