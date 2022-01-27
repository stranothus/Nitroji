# Discord Template

This is the perfect place to start for any Discord bot. Slash commands are already set up to function exactly the same as text commands. Don't worry about seperate files because you can store the slash command variant in the same export as text commands. Anything inside the commands folder is automatically registered as a command, so you don't need to worry about changing event listeners manually for new commands. Even Direct Message commands work!

## Getting started

Getting started is as easy four steps.

1. Use `git clone https://github.com/stranothus/Discord-Template.git` in the parent directory. 
2. cd into the resulting directory and run `npm install` to install node_modules. 
3. Create your Discord application and create a bot for it. 
4. Create a .env file with your bot token like `TOKEN="your token here"`

And you can start running your Discord bot right away!

## Adding commands

To add a command, create a new file in the commands folder. You'll need to export an object of the following syntax:

```json
{
    data: // slash command with the name, description, and any arguments you need
    DMs: // boolean for whether to allow the command to be used in Direct Messages or not
    execute: // the function to execute for the slash command variant (has an interaction argument)
    executeText: // the function to execute for the text command variant (has the message object passed and the parsed command arguments)
}
```

Look at commands/ping.js to get a simple idea!

## Adding events

A Discord bot might need additional event listeners. This is a simple export

```json
{
    type: // "on" or "once"
    name: // the event to listen for
    execute: // the function to run when the event is heard
}
```

## Further development

Adding events and commands is a good start, but you'll also need to add more for larger scale bots. Feel free to edit any existing files. Make sure to read the code comments so you know what you're doing!