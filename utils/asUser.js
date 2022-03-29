import { Permissions } from "discord.js";

async function asUser(channel, author, content, files) {
    if(!(channel.guild || channel.parent.guild).me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return;
    
    if(channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD") {
        let webhook = (await channel.parent.fetchWebhooks()).filter(webhook => webhook.name === channel.client.user.tag).first() || await channel.parent.createWebhook(channel.client.user.tag);

        await webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "threadId": channel.id,
            "files": files.map(v => v.url)
        });
    } else {
        let webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === channel.client.user.tag).first() || await channel.createWebhook(channel.client.user.tag);

        await webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "files": files.map(v => v.url)
        });
    }
}

export default asUser;