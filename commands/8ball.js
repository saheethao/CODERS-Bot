module.exports = {
	name: '8ball', // Will be the command name. Example bot.ping...
	aliases: ['ask', 'fortune'],
	args: false,  // Requires arguements
	numArgs: -1,   // can ask a question
	usage: '<optional question>...',
	description: 'Ask the bot a yes or no question.',
	authors: ['Sahee Thao'],
	lastModified: '10/07/20',
	version: '1.0.1',
	execute(message, args) {
		answers = [
		    // Positive
			'It is certain.',
			'It is decidedly so.',
			'Without a doubt.',
			'Obviously yes.',
			'You may rely on it.',
			'Chances are good.',
			'Most likely.',
			'It\'s a yes from me.',
			'Yes.',
			'I think so.',
			'You can count on it.',
			'Definately yes.',
			'Yes yes yes.',
			// Neutral
			'Let me think about that...ask again.',
			'I don\'t know.',
			'Good question.',
			'Better not tell you know',
			'I can\'t predict that now.',
			'Can you rephrase that?',
			'Outlook? Not too bad.',
			'You guess is as good as mine.',
			// Negative
			'Don\'t count on it.',
			'It\'s a no from me.',
			'I don\'t think so.',
			'My reply is no.',
			'A strong no.',
			'Outlook not so good.',
			'Very doubtful.',
			// Sarcastic
			'As if!',
			'Ha good one. Okay so what\'s the real question?',
			'Get a clue.',
			'In your dreams.',
			'Obviously no.',
			'Oh please.',
			'Well maybe.',
			'Ha! You wish.',
			'Let\'s just say somethings are best left unanswered.',

		];
		let ans = answers[Math.floor(Math.random() * answers.length)];
		if (args.length > 0) {
			message.channel.send('> ' + args.join(' '));
		}
		return ans;
	},
};