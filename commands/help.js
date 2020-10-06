module.exports = {
	name: 'help',
	aliases: ['man'],
	args: false, // No required arguements
	numArgs: 1, // One optional arguement
	usage: '<optional command name>',
	description: 'Use this command to receive list of commands',
	authors: ['Sahee Thao'],
	lastModified: '10/06/20',
	version: '1.0.1',
	execute(message, args) {
		const { prefix } = require('../../config.json');
		const client = message.client;
		const commands = client.commands;
		if (args.length === 1) {
			/* Is looking for help on a command */
			const command = commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
			if (!command) {
				let content = '`' + args[0] + '` is not a command.';
				return message.channel.send(content); 
			}
			let wrapFunction = function(x) {return '`' + x + '`';}
			let content = 'Command Name: `' + command.name + '`\n';
			let formatAliases = command.aliases.map(wrapFunction);

			content += 'Aliases: ' + formatAliases.join(' ') + '\n';
			content += 'Usage: `' + prefix + command.name + ' ' + command.usage + '`\n';
			content += 'Description: `' + command.description + '`\n';
			
			let formatAuthors = command.authors.map(wrapFunction);
			content += 'Authors: `' + formatAuthors.join(' ') + '`\n';
			content += 'Last Modified: `' + command.lastModified + '`\n';
			content += 'Version: `' + command.version + '`';
			return message.channel.send(content);
		} else {
			/* Is looking for list of all commands */
			let content = '**Commands**: ';
			let commandArr = [];
			for (let [key, command] of commands) {
				commandArr.push('`' + command.name + '`');
			}
			commandArr.sort();
		
			content += commandArr.join(' ');
			content += '\n\nUse `' + prefix + this.name + ' ' + this.usage + '` to find out more about a command.';
			content += '\n\nSee more about the bot here: https://github.com/saheethao/CODERS-Bot';
			
			return message.channel.send(content);
		}
	},
};