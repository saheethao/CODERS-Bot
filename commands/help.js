module.exports = {
	name: 'help',
	args: false, // No required arguements
	numArgs: 1, // One optional arguement
	usage: '<optional command name>',
	description: 'Use this command to receive list of commands',
	authors: ['Sahee Thao'],
	lastModified: '10/05/20',
	version: '1.0.0',
	execute(message, args) {
		const { prefix } = require('../../config.json');
		const client = message.client;
		const commands = client.commands;
		if (args.length === 1) {
			/* Is looking for help on a command */
			if (!commands.has(args[0])) {
				let content = '`' + args[0] + '` is not a command.';
				return message.channel.send(content); 
			}
			command = commands.get(args[0]);
			let content = 'Command Name: `' + command.name + '`\n';
			content += 'Usage: `' + prefix + command.name + ' ' + command.usage + '`\n';
			content += 'Description: `' + command.description + '`\n';
			content += 'Authors: `' + command.authors.join(' ') + '`\n';
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
			return message.channel.send(content);
		}
	},
};