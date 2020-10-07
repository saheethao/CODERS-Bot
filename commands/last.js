module.exports = {
	name: 'last',
	aliases: ['lastMessage'],
	args: false,
	numArgs: 2,
	usage: '<optional @nickname> <optional channel name>',
	description: 'Outputs the last message (default the called channel), not including the given command. Optionally from a person or from a channel (or both). The command detects a single arguement as a person if it starts with @. Otherwise it is the channel name. When there are two arguements, the first must be the nickname, and the second must be the channel name. This command only looks at the last 500 messages.',
	authors: ['Sahee Thao'],
	lastModified: '10/07/20',
	version: '1.0.0',
	async execute(message, args) {
		
			function getUserFromMention(mention, client) {
				if (!mention) return null;

				if (mention.startsWith('<@') && mention.endsWith('>')) {
					mention = mention.slice(2, -1);

					if (mention.startsWith('!')) {
						mention = mention.slice(1);
					}
					const retVal = client.users.cache.get(mention);
					if (retVal == null) {
						return -1;
					}
					return client.users.cache.get(mention);
				}
				return null;
			}
			
			async function fetchFiveHundred(user, channel, differ) {
				let content = null;
				let found = false;
				let lastMessage = null;
				let promise = await channel.messages.fetch({ limit: 100 });
				promise = await Promise.resolve(promise).then(function(v) {
					return v;
				});
				let count = 0;
				for (let [key, value] of promise) {
					if (value.author.id == user.id && (count > 0 || differ)) {
						content = await value.content;
						console.log('Found! ' + content);
						found = true;
						break;
					}
					lastMessage = value;
					count++;
				}
				if (found) {
					return content;
				}
				
				if (count < 100) {
					return null;
				}
				let i = 0;
				for (i = 0; i < 4; i++) {
					promise = await channel.messages.fetch({ limit: 100, after: lastMessage.id});
					promise = await Promise.resolve(promise).then(function(v) {
						return v;
					});
					count = 0;
					for (let [key, value] of promise) {
						if (value.author.id == user.id) {
							content = await value.content;
							console.log('Found! ' + content);
							found = true;
							break;
						}
						lastMessage = value;
						count++;
					}
				
					if (found) {
						return content;
					}
					
					if (count < 100) {
						return null;
					}
				}
				return null;
			}
		console.log('Enter');

		let content = 'Not Implemented';

		if (args.length == 0) {
			const channel = message.client.channels.cache.get(message.channel.id);
			let promise = await channel.messages.fetch({ limit: 2 });
			promise = await Promise.resolve(promise).then(function(v) {
				return v;
			});
			promise.forEach((value, key) => {
				content = value.content;
			});
			console.log('content: ' + content);
			
		} else if (args.length == 1) {
			let user = await getUserFromMention(args[0], message.client);
			if (user != null) {
				console.log('user time');
				if (user === -1) {
					return 'User ' + args[0] + ' was not found.';
				}
				const channel = message.client.channels.cache.get(message.channel.id);
				content = await fetchFiveHundred(user, channel, false);
				if (content == null) {
					return 'No Message Found';
				}
			} else {
				console.log('channel time');
				const channel = message.guild.channels.cache.find(channel => channel.name === args[0]);
				if (channel == null) {
					return 'Channel ' + args[0] + ' was not found.';
				}
				if (channel.id != message.channel.id) {
					console.log('another channel');
					let promise = await channel.messages.fetch({ limit: 1 });
					promise = await Promise.resolve(promise).then(function(v) {
						return v;
					});
					
					promise.forEach((value, key) => {
						content = value.content;
					});
				} else {
					console.log('wait its this channel');
					let promise = await channel.messages.fetch({ limit: 2 });
					promise = await Promise.resolve(promise).then(function(v) {
						return v;
					});
					promise.forEach((value, key) => {
						content = value.content;
					});
				}

			}
		} else if (args.length == 2) {
			let user = await getUserFromMention(args[0], message.client);
			
			if (user === -1) {
				return 'User ' + args[0] + ' was not found.';
			}
			
			const channel = message.guild.channels.cache.find(channel => channel.name === args[1]);
			if (channel == null) {
				return 'Channel ' + args[1] + ' was not found.';
			}
			
			let differ = channel.id != message.channel.id;
			
			content = await fetchFiveHundred(user, channel, differ);
			
			if (content == null) {
				return 'No Message Found';
			}
		}
		console.log('CONTENT: ' + content);
		console.log('Exit');
		return content;
	},
};