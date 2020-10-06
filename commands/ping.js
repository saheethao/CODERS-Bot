module.exports = {
	name: 'ping', // Will be the command name. Example !ping...
	args: false,  // Requires arguements
	numArgs: 0,   // No arguements
	usage: '',    // Denotes no usage
	description: 'Ping Pong!',
	authors: ['Sahee Thao'],
	lastModified: '10/05/20',
	version: '1.0.0',
	execute(message, args) {
		return message.channel.send('Pong.');
	},
};