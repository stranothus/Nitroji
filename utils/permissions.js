import { Permissions } from "discord.js";

const perms = clientPerms => 
	clientPerms.has(Permissions.FLAGS.MANAGE_MESSAGES) && 
	clientPerms.has(Permissions.FLAGS.MANAGE_WEBHOOKS) && 
	clientPerms.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) && 
	clientPerms.has(Permissions.FLAGS.ATTACH_FILES) && 
	clientPerms.has(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS) && 
	clientPerms.has(Permissions.FLAGS.USE_PUBLIC_THREADS) && 
	clientPerms.has(Permissions.FLAGS.SEND_MESSAGES);

export default perms;