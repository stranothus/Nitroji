 // import packages
import discord from "discord.js";
import dotenv from "dotenv";
import dirFlat from "./utils/dirFlat.js";
import { MongoClient, ServerApiVersion } from "mongodb";

 // load env variables
dotenv.config();

global.db = await new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rissn.mongodb.net/Users?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true, 
			useUnifiedTopology: true, 
			serverApi: ServerApiVersion.v1
        },
        (err, db) => {
            if(err) console.error(err);

            console.log("DB connected");

            resolve(db);
        }
    );
});

 // create the Discord client with basic intents
const client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS"
    ],
    partials: [
        "CHANNEL"
    ]
});

 // load all events and set them up
Promise.all(dirFlat("./events").map(async v => {
    let imported = await import("./" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
})).then(events => events.forEach(event => client[event.type](event.name, event.execute)));

 // log the bot in
client.login(process.env.TOKEN).catch(console.log);
