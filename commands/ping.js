module.exports = {
	name: 'ping', // Will be the command name. Example !ping...
	aliases: ['pong'],
	args: false,  // Requires arguements
	numArgs: 0,   // No arguements
	usage: '',    // Denotes no usage
	description: 'Ping Pong!',
	authors: ['Sahee Thao'],
	lastModified: '10/06/20',
	version: '1.0.1',
	execute(message, args) {
		return 'Pong.';
	},
};