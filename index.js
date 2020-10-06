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

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	if (!client.commands.has(commandName)) {
		message.channel.send('Error: `' + commandName + '` is not a valid command.');
		console.log('Recieved invalid commandName "' + commandName + '"');
		return;
	}
	const command = client.commands.get(commandName);
	
	if (command.args) {
		/* Command requires arguements */
		if (command.numArgs < 0) {
			/* Unlimited arguements */
			if (args.length == 0) {
				arguementError(message, command);
				return;
			}
		} else if (command.numArgs > 0) {
			/* Limited Arguements */
			if (args.length != command.numArgs) {
				arguementError(message, command);
				return;
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
				arguementError(message, command);
				return;
			}
		} else {
			/* No Arguements */
			if (args.length > 0) {
				arguementError(message, command);
				return;
			}
		}
	}
	
	try {
		command.execute(message, args);
		console.log('Executed command "' + commandName + '"');
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

function arguementError(message, command) { 
	let reply = 'Improper usage of `' + command.name + '`';
	reply += '\nProper usage of ' + command.name + ': ' + '`' + prefix + '' + command.name;
	if (command.usage) {
		reply += ' ' + command.usage + '`';
	} else {
		reply += '`';
	}
	message.channel.send(reply);
}

/*

function messageHelp(message, command, args) {
	if (args.length > 0) {
		message.channel.send('ERROR: ' + commandStringFormat(command) + ' should have no arguements.');
		return;
	}
	let content = 
	'**Command Prefix**: `' + prefix + '`';
	content += '\n**Commands**: ';
	
	for (var c of commandList) {
		content += commandStringFormat(c) + ' ';
	}
	message.channel.send(content);
}

function messageInfo(message, command, args) {
	if (args.length > 1 || args.length == 0) {
		message.channel.send('ERROR: ' + commandStringFormat(command) + ' should have one arguement. The arguement should be a valid command.');
		return;
	}
	var c = '';
	for (c of commandList) {
		if (c == args[0]) {
			break;
		}
	}
	if (c == '') {
		message.channel.send('ERROR: ' + args[0] + ' is not a valid command. Use `help` to see valid commands.';
		return;
	}
	
	if (c == 'help') {
		
	}
	
}

function commandStringFormat(c) {
	return '`' + c + '`';
}
*/
client.login(token);