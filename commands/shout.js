module.exports = {
	name: 'shout', // Will be the command name. Example !shout...
	aliases: ['upper', 'yell', 'toupper', 'capitalize'], // other names
	args: true, // Required arguements
	numArgs: -1, // Unlimited arguements
	usage: '<any> <any>...', // pattern for arguement. In this case we can have unlimited arguements
	description: 'SHOUTS THE TEXT',
	authors: ['Sahee Thao'],
	lastModified: '10/06/20',
	version: '1.0.1',
	execute(message, args) {
		
		// Assign upper to a function which takes a parameter x and returns x but uppercased
		const upper = function(x) {
			return x.toUpperCase();
		};
		
		// Using map, for each element in args (an array), apply the upper function to the element.
		args = args.map(upper);
		return args.join(' ');
	},
	
};