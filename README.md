# CODERS-Bot
Used for the CODERS Discord server.


Requires a config.json file one directory out of this directory with the following.
```json
{
	"prefix": "!",
	"token": "YOUR TOKEN HERE"
}
```

## Adding a new command
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