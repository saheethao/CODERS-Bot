const datamuse = require('datamuse');
 
datamuse.words({
  topics: 'smoke'
})
.then((json) => {
  console.log(json);
  //do it!
});