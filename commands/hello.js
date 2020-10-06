module.exports = {
	name: 'hello', // Will be the command name. Example !hello...
	aliases: [],
	args: true,    // Required arguements
	numArgs: 1,    // 1 arguement
	usage: '<any>',// pattern for arguement. In this case only requires one arguement, which can be anything. Usage !hello <any>
	description: 'Says hello to something',
	authors: ['Sahee Thao'],
	lastModified: '10/06/20',
	version: '1.0.1',
	execute(message, args) {
		return 'hello ' + args[0];
	},
};