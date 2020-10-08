/* Main file */
/*
 * Description: Initializes bot, db, and listens for commands. All logic handling basic command errors occur here.
 *                  Command piping also occurs here.
 * Version: 1.1.1
 * Last Modified: 10/06/20
 * Authors: Sahee Thao
 */
const fs = require('fs'); // File system
const Discord = require('discord.js'); // Discord.js
const Sequelize = require('sequelize'); // Sequalize

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

var emojiDict = {
	'gow': 'joe',
	'chancellor': 'joe',
	'sam': 'foley',
	'parallel': 'foley',
	'parallelism': 'foley',
	'os': 'foley',
	'ssfoley': 'foley',
	'elliot': 'forbes',
	'architecture': 'forbes',
	'thomas': 'gendreau',
	'kenny': 'hunt',
	'sunglasses': 'hunt',
	'john': 'maraist',
	'david': 'mathias',
	'genetic': 'mathias',
	'woodworking': 'mathias',
	'periyasamy': 'kasi',
	'allie': 'asauppe',
	'allison': 'asauppe',
	'alley': 'asauppe',
	'discrete': 'jsauppe',
	'optimization': 'jsauppe',
	'jason': 'jsauppe',
	'json': 'jsauppe',
	'lei': 'wang',
	'yoshizomi': 'becky',
	'mao': 'zheng'
}

/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage INT
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


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
	Tags.sync();
	console.log('State: Ready');
});

// CHEAT SHEET https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

/* 
 * On Message Event
 * Messages: https://discord.js.org/#/docs/main/master/class/Message
 * On 
 */
client.on('message', function(message) {
	myFunction(message);
});

async function myFunction(message) {
	if (message.author.bot) {
		return;
	}
	
	if (!message.content.startsWith(prefix)) {
		let passiveReply = passive(message);
		if (passiveReply != null) {
			message.channel.send(passiveReply);
		}
		return;
	}
	let content = await pipeCommand(message);
	
	if (content == null || content == '') {
		return;
	}
	message.channel.send(content);
}

async function pipeCommand(message) {
	if (!message.content.startsWith(prefix)) {
		return 'The prefix `' + prefix +'` is missing.';
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return null;	
	let args = message.content.slice(prefix.length).trim().split(/ +/);
		
	let nextArgs = [];
	let pipeFlag = false;
	for (var i = 0; i < args.length; i++) {
		if (args[i] === '->') {
			pipeFlag = true;
			nextArgs = args.slice(i+1);
			if (i < args.length - 1) {
				if (args[i+1] === '->') {
					return 'Invalid use of piping.';
				}
			}
			if (i == args.length - 1) {
				return 'Missing next command to pipe.';
			}
			args = args.slice(0, i);
		}
	}
	
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
		let content = await command.execute(message, args);
		console.log('Executed command "' + commandName + '"');
		if (pipeFlag) {
			for (var i = 0; i < nextArgs.length; i++) {
				if (nextArgs[i] === '->') {
					if (i < args.length - 1) {
						if (args[i+1] === '->') {
							return 'Invalid use of piping.';
						}
					}
					
					if (i == args.length - 1) {
						return 'Missing next command to pipe.';
					}
					break;
				}
			}
			if (command.name == 'fetch') {
				let msgMap = Promise.resolve(content);
			}
			nextArgs.splice(i, 0, content);
			message.content = nextArgs.join(' '); // NOT SURE IF THIS IS PROPER
			return await pipeCommand(message);
		} else {
			//content = Promise.resolve(content).then(function(value) { console.log('vType: ' + typeof value + ', vval: ' + value); return value; });
			//console.log('Type: ' + typeof content + ', val: ' + content);
			//console.log('hello!');
			return content;
		}
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
}

/* Display Errors */
function arguementError(message, command) { 
	let reply = 'Improper usage of `' + command.name + '`.';
	reply += '\nProper usage of ' + command.name + ': ' + '`' + prefix + '' + command.name;
	if (command.usage) {
		reply += ' ' + command.usage + '`.';
	} else {
		reply += '`.';
	}
	return reply;
}

/* Message does not take in commands */
function passive(message) {
	console.log('heard: ' + message.content);
	function isAlpha(c) {
		return /^[A-Z]$/i.test(c);
	}
	let shouldSend = false;
	let words = message.content;
	
	let newWords = '';
	let w = '';
	
	let watchEmoji = 0;
	
	for (var i = 0; i < words.length; i++) {
		var c = words.charAt(i);
		if (c == '<' && i < words.length - 1) {
			if (words.charAt(i+1) == ':') {
				watchEmoji = 1;
			}
		}
		
		if (!isAlpha(c) && w != '') {
			if (watchEmoji == 1 && c == ':') {
				console.log('EMOJI DETECTED');
				watchEmoji = 2;
			}
			let emoji = null;
			if (message.guild == null) {
				
			} else {
				let lookup = w.toLowerCase();
				
				const change = emojiDict[lookup];
				if (change != null) {
					lookup = change;
				}
				
				emoji = message.guild.emojis.cache.find(e => e.name == lookup);
			}
			if (emoji == null || watchEmoji == 2) {
				//console.log(w + ' => No emoji found');
			} else {
				let e = `<:${emoji.name}:${emoji.id}>`;
				newWords += e;
				shouldSend = true;
			}
			w = ''; // Reset w
		} else {
			if (isAlpha(c)) {
				w += c;
			}
		}
		newWords += c;
	}
	
	if (w != '') {
		if (watchEmoji == 1 && c == ':') {
			console.log('EMOJI DETECTED');
			watchEmoji = 2;
		}
		let emoji = null;
		if (message.guild == null) {
			
		} else {
			let lookup = w.toLowerCase();
			
			const change = emojiDict[lookup];
			if (change != null) {
				lookup = change;
			}
			
			emoji = message.guild.emojis.cache.find(e => e.name == lookup);
		}
		if (emoji == null || watchEmoji == 2) {
			//console.log(w + ' => No emoji found');
		} else {
			let e = `<:${emoji.name}:${emoji.id}>`;
			newWords += e;
			shouldSend = true;
		}
		w = ''; // Reset w
	}
	
	if (shouldSend) {
		return newWords;
	}
	return null;
}


client.login(token);