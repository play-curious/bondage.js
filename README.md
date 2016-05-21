# bondage.js [![Build Status](https://travis-ci.org/jessicahayley/bondage.js.svg?branch=master)](https://travis-ci.org/jessicahayley/bondage.js)
[Yarn](https://github.com/InfiniteAmmoInc/Yarn) parser for Javascript, in the same vein as [YarnSpinner](https://github.com/thesecretlab/YarnSpinner).

# Work in Progress

Some of the base text/option functionality is there but it is not nearly fully feature complete. See the [Milestones](https://github.com/jessicahayley/bondage.js/milestones) for what's currently needs to be worked on.
Use at your own risk!

### Things that don't currently work:
* Variables
* If statements
* Shortcut Options
* Functions

# Usage

Installation: `npm install bondage`

```javascript
const fs = require('fs');
const bondage = require('bondage');

const dialogue = new bondage.Dialogue();
const yarnData = JSON.parse(fs.readFileSync('yarnFile.json'));

dialogue.load(yarnData);

dialogue.on('start', () => {
  // Called before dialogue is ran
});
dialogue.on('finish', () => {
  // Called after dialogue has finished
});

dialogue.on('line', (result) => {
  // Called when a line of text should be displayed
  console.log(result.text);
});
dialogue.on('options', (result) => {
  // Called when there is a choice to be made
  // result.options is a list of options
  for (const option of result.options) {
    console.log(option);
  }

  // Specify which option is chosen (must be called before the next iteration of the loop)
  result.choose(result.options[0]);
});
dialogue.on('command', (result) => {
  // Called when a command like <<command text>> is encountered
  console.log(result.command);
});
dialogue.on('nodecomplete', (result) => {
  // Called when we finish a node
  console.log(result.nodeName);
});

// Loop over the dialogue from the node titled 'Start'
// The result returned to this loop is the same as the ones passed to the listeners above, but
// the attached event listeners get called before the result is returned to this loop
for (const result of dialogue.run('Start')) {
  // Do something else with the result
}

// Advance the dialogue manually from the node titled 'Start'
const d = dialogue.run('Start')
let result = d.next().value;
let nextResult = d.next().value;
// And so on
```
