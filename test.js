const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var moby = require('moby')

let noNew = ['I', 'YOU', 'HE', 'SHE', 'WE', 'AM', 'ARE', 'IS', 'HE', 'HIM', 'HIS', 'SHE', 'HER', 'HERS', 'YOURSELF',
'HIMSELF', 'HERSELF', 'THEY', 'THEIR', 'THEIRS', 'THEMSELF', 'THEMSELVES'];

readline.setPrompt('input> ');
readline.prompt();
readline.on('line', function(line) {
	/* Exit */
    if (line === "exit") readline.close();
	var newLine = ''; // Output
	var words = line.split(' '); // Create new words
	
	/* For each word w */
	for (var w of words) {
		w = w.toUpperCase();
		if (noNew.includes(w)) {
			newLine += w + ' ';
			continue;
		}		
		const newWords = moby.search(w);
		
		if (newWords.length == 0) {
			newLine += w + ' ';
			continue;
		}
		
		const newW = newWords[Math.floor(Math.random() * newWords.length)];
		newLine += newW + ' ';
		
	}
	console.log(newLine);
	//console.log(words);
    readline.prompt();
}).on('close',function(){
    process.exit(0);
});


// Using Moby











// Bot permissions: https://discord.com/api/oauth2/authorize?client_id=759235855054274591&permissions=252992&scope=bot