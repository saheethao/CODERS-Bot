module.exports = {
	name: 'thesaurize',
	aliases: ['t'],
	args: true,
	numArgs: -1,
	usage: '<any> <any>...',
	description: 'Thesaurizes given text. Does not support text of the following nature <text><punctiotion><text> with no spaces between. Only the first text will be thesaurized.',
	authors: ['Sahee Thao'],
	lastModified: '10/06/20',
	version: '1.1.0',
	execute(message, args) {
		var moby = require('moby')
		var isAlpha = function(c) {
			return /^[A-Z]$/i.test(c);
		}

		let exclude = ['I', 'YOU', 'HE', 'SHE', 'WE', 'AM', 'ARE', 'IS', 'HE', 'HIM', 'HIS', 'SHE', 'HER', 'HERS', 'YOURSELF',
					'HIMSELF', 'HERSELF', 'THEY', 'THEIR', 'THEIRS', 'THEMSELF', 'THEMSELVES'];
		
		class Word {
			constructor(inWord) {
				this.formatType = 0; // Is all lowercase
				this.specialFormat = [];
				this.leftChars = '';
				this.inWord = '';
				this.rightChars = '';
				
				var cStage = 0;
				for (var i = 0; i < inWord.length; i++) {
					var currentC = inWord.charAt(i);
					if (cStage === 0 && isAlpha(currentC)) {
						cStage = 1;
					} else if (cStage === 1 && !isAlpha(currentC)) {
						cStage = 2;
					}
					
					if (cStage === 0) {
						this.leftChars += currentC;
					} else if (cStage === 1) {
						this.inWord += currentC;
					} else if (cStage == 2) {
						this.rightChars += currentC;
					}
				}
				
				
				
				if (inWord === inWord.toUpperCase()) {
					this.formatType = 1; // Is all uppercase
				} else {
					if (!( inWord === inWord.toLowerCase() )) {
						this.formatType = -1; // Specialcase
						// Is NOT all lowercase
						for (var i = 0, len = inWord.length; i < len; i++) {
							var c = inWord.charAt(i);
							if (c === c.toUpperCase()) {
								this.specialFormat.push(i);
							}
						}
					}
				}
			}
			
			generateOutWord(moby, exclude) {
				const w = this.inWord.toUpperCase();
				/* Excluded words */
				if (exclude.includes(w)) {
					return this.inWord;
				}
				
				const newWords = moby.search(w);
				
				/* No synonym found */
				if (newWords.length == 0) {
					return this.inWord;
				}
				var outWord = newWords[Math.floor(Math.random() * newWords.length)];
				console.log(outWord);
				if (outWord.split(' ').length > 1) {
					outWord = outWord.split(' ');
				}
				/* Format outWord */
				if (this.formatType === 0) {
					if (Array.isArray(outWord)) {
						return outWord.map(function(x) {return x.toLowerCase();} ).join(' ');
					} else {
						return outWord.toLowerCase();
					}
				} else if (this.formatType === 1) {
					if (Array.isArray(outWord)) {
						return outWord.map(function(x) {return x.toUpperCase();} ).join(' ');
					} else {
						return outWord.toUpperCase();
					}
				} else {
					/* 5 Types of specialcase */
					/* Capital Case, reversE capitaL casE, mOcK cAsE, LaTeX CaSe, ValleY CasE, mOUNTAIn cASe */
					if (this.specialFormat.length === 1) {
						// capital, reverse capital
						if (this.specialFormat[0] === 0) {
							// capital
							if (Array.isArray(outWord)) {
								console.log('Capital Array');
								return outWord.map(function(o){ return o.charAt(0).toUpperCase() + o.slice(1); }).join(' ');
							} else {
								console.log('Capital');
								return outWord.charAt(0).toUpperCase() + outWord.slice(1);
							}
						} else if (this.specialFormat[0] === this.inWord.length - 1) {
							// reverse
							if (Array.isArray(outWord)) {
								return outWord.map(function(o){return o.substring(0, o.length - 1) + o.charAt(o.length - 1).toUpperCase();}).join(' ');
							} else {
								return outWord.substring(0, outWord.length - 1) + outWord.charAt(outWord.length - 1).toUpperCase();
							}
						} else {
							// Super special case, do nothing
							if (Array.isArray(outWord)) {
								return outWord.join(' ');

							} else {
								return outWord;
							}
						}
					} else {
						// Create the arrays of special types
						/* mock case */
						const len = this.inWord.length;
						var i = 0;
						var target = 1;
						let passed = true;
						for (i = 0; i < this.specialFormat.length; i++) {
							const num = this.specialFormat[i];
							if (target === num) {
								// pass
							} else {
								passed = false;
								break;
							}
							target += 2;
						}
						
						if (passed) {
							// reverse
							if (Array.isArray(outWord)) {
								var outs = [];
								for (var o of outWord) {
									var fo = "";
									for (i = 0; i < fo.length; i++) {
										if (i % 2 == 1) {
											fo += fo.charAt(i).toUpperCase();
										} else {
											fo += fo.charAt(i);
										}
									}
									outs.push(fo);
								}
								return outs.join(' ');
							} else {
								var fOutWord = "";
								for (i = 0; i < outWord.length; i++) {
									if (i % 2 == 1) {
										fOutWord += outWord.charAt(i).toUpperCase();
									} else {
										fOutWord += outWord.charAt(i);
									}
								}
								return fOutWord;
							}
						}
						
						/* latex case */
						target = 0;
						passed = true;
						for (i = 0; i < this.specialFormat.length; i++) {
							const num = this.specialFormat[i];
							if (target === num) {
								// pass
							} else {
								passed = false;
								break;
							}
							target += 2;
						}
						
						if (passed) {
							if (Array.isArray(outWord)) {
								var outs = [];
								for (var o of outWord) {
									var fo = ""
									for (i = 0; i < outWord.length; i++) {
										if (i % 2 == 0) {
											fo += outWord.charAt(i).toUpperCase();
										} else {
											fo += outWord.charAt(i);
										}
									}
									outs.push(fo);
								}
								return outs.join(' ');
							} else {
								var fOutWord = ""
								for (i = 0; i < outWord.length; i++) {
									if (i % 2 == 0) {
										fOutWord += outWord.charAt(i).toUpperCase();
									} else {
										fOutWord += outWord.charAt(i);
									}
								}
								return fOutWord;
							}
						}
						
						/* valley case */
						if (this.specialFormat.length == 2) {
							passed = true;
							if (this.specialFormat[0] === 0 && this.specialFormat[1] === this.inWord.length - 1) {
								
							} else {
								passed = false;
							}
						
							if (passed) {
								if (Array.isArray(outWord)) {
								return outWord.map(function(o){
									return o.charAt(0).toUpperCase() + o.substring(1, o.length - 1) + o.charAt(o.length - 1).toUpperCase();
								}).join(' ');
								} else {
									var fOutWord = outWord.charAt(0).toUpperCase() + outWord.substring(1, outWord.length - 1) + outWord.charAt(outWord.length - 1).toUpperCase();
									return fOutWord;
								}
							}
						}
						
						/* mountain case */
						target = [];
						for (i = 1; i < len - 1; i++) {
							target.push(i);
						}
						
						if (target.length == this.specialFormat.length) {
							passed = true;
							for (i = 0; i < target.length; i++) {
								if (target[i] === this.specialFormat[i]) {
									// pass
								} else {
									passed = false;
									break;
								}
							}
						
							if (passed) {
								if (Array.isArray(outWord)) {
								return outWord.map(function(o) {
									o.charAt(0) + o.substring(1, o.length - 1).toUpperCase() + o.charAt(o.length - 1);
								}).join(' ');
								} else {
									var fOutWord = outWord.charAt(0) + outWord.substring(1, outWord.length - 1).toUpperCase() + outWord.charAt(outWord.length - 1);
									return fOutWord;
								}
							}
						}
						
						/* Failed all special cases */
						if (Array.isArray(outWord)) {
							return outWord.join(' ');

						} else {
							return outWord;
						}
					}
				}
			}
		}
		
		contents = [];
		
		for (var a of args) {
			var w = new Word(a);
			contents.push(w.leftChars + w.generateOutWord(moby, exclude) + w.rightChars);
		}
		
		
		return message.channel.send(contents.join(' '));
	},
	
};