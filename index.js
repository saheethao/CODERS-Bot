/* Main file */

const fs = require('fs'); // File system
const Discord = require('discord.js'); // Discord.js

const { prefix, token } = require('../config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Get array of file names */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log('Requiring ' + file);
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('State: Ready');
});

// CHEAT SHEET https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

/* 
 * On Message Event
 * Messages: https://discord.js.org/#/docs/main/master/class/Message
 * On 
 */
client.on('message', function(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	let content = pipeCommand(message);
	
	if (content == null) return;
	message.channel.send(content);
});

function pipeCommand(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return null;	
	let args = message.content.slice(prefix.length).trim().split(/ +/);
	
	console.log('args before: ' + args);
	
	let nextArgs = [];
	let pipeFlag = false;
	for (var i = 0; i < args.length; i++) {
		if (args[i] === '->') {
			pipeFlag = true;
			nextArgs = args.slice(i+1);
			args = args.slice(0, i);
		}
	}
	
	console.log('args after: ' + args);
	console.log('next args: ' + nextArgs);

	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		console.log('Recieved invalid commandName "' + commandName + '"');
		return 'Error: `' + commandName + '` is not a valid command.';		
	}
	
	if (command.args) {
		/* Command requires arguements */
		if (command.numArgs < 0) {
			/* Unlimited arguements */
			if (args.length == 0) {
				return arguementError(message, command);
			}
		} else if (command.numArgs > 0) {
			/* Limited Arguements */
			if (args.length != command.numArgs) {
				return arguementError(message, command);
			}
		}
	} else {
		/* Command should NOT have REQUIRED arguements */
		if (command.numArgs < 0) {
			/* Unlimited arguements */
			/* Do nothing */
		} else if (command.numArgs > 0) {
			/* Limited Arguements */
			if (args.length > command.numArgs) {
				return arguementError(message, command);
			}
		} else {
			/* No Arguements */
			if (args.length > 0) {
				return arguementError(message, command);
			}
		}
	}
	
	try {
		const content = command.execute(message, args);
		console.log('Executed command "' + commandName + '"');
		if (pipeFlag) {
			for (var i = 0; i < nextArgs.length; i++) {
				if (nextArgs[i] === '->') {
					break;
				}
			}
			nextArgs.splice(i, 0, content);
			message.content = nextArgs.join(' ');
			return pipeCommand(message);
		} else {
			return content;
		}
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
}

/* Display Errors */
function arguementError(message, command) { 
	let reply = 'Improper usage of `' + command.name + '`';
	reply += '\nProper usage of ' + command.name + ': ' + '`' + prefix + '' + command.name;
	if (command.usage) {
		reply += ' ' + command.usage + '`';
	} else {
		reply += '`';
	}
	return reply;
}


client.login(token);