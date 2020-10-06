# CODERS-Bot
Used for the CODERS Discord server.

## Adding a new command
Before you proceed it worth noting, you should know basic programming and basic JavaScript to write a command. See the refrences below to get started, or if you are already experienced, it is a good place to get some references.

Commands are added in the commands directory.

They have the following format:
```JavaScript
module.exports = {
	name: 'commandname', // Will be the command name.
	args: false,  // true means will require arguements, false means will NOT require arguements or may have optional arguements
	numArgs: 0,   // 0 means no arguements. -1 means unlimited arguements. If args is false and numArgs != 0, then these are optional arguements 
	usage: '<string>',    // Denotes expected arguement usage. For example: "<number> <any>" or "<string> <integer> <number>"
	description: 'Description', // Describe the command here.
	authors: ['Sahee Thao'], // Enter authors in a string array.
	lastModified: '10/05/20', // The date when this file was last modified
	version: '1.0.0', // The current version of this command
	execute(message, args) {
		/* Enter logic of command here */
		/* message is an message object. See https://discord.js.org/#/docs/main/master/class/Message */
		/* args is a string array with the arguments. For example: ['hello', 'world'] */
		return message.channel.send('Pong.');
	},
};
```

## Running the bot
This bot uses Discord.js with Node.js.

Additionally, in order to run the bot, it requires a config.json file one directory up (../this directory) with the following.
```json
{
	"prefix": "!",
	"token": "YOUR TOKEN HERE"
}
```

### Some references
* [Learning JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
* [Running JavaScript Code in the Browser](https://playcode.io/empty/)
* [JavaScript Documentation and Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Node.js](https://nodejs.org/en/)
* [Discord.js](https://discord.js.org/)
* [Discord.js Guide](https://discordjs.guide/)
* [Discord Markdown](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-)