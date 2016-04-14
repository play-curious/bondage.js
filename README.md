# bondage.js [![Build Status](https://travis-ci.org/jessicahayley/bondage.js.svg?branch=master)](https://travis-ci.org/jessicahayley/bondage.js)
[Yarn](https://github.com/InfiniteAmmoInc/Yarn) parser for Javascript, in the same vein as [YarnSpinner](https://github.com/thesecretlab/YarnSpinner).

# Work in Progress

Some of the base text/option functionality is there but it is not nearly fully feature complete. See the [Milestones](https://github.com/jessicahayley/bondage.js/milestones) for what's currently needs to be worked on.
Use at your own risk!

### Things that don't currently work:
* Named links
* Variables
* If statements
* Shortcut Options
* Commands
* Functions

# Usage

Installation: `npm install bondage`

```javascript
const fs = require('fs');
const bondage = require('bondage');

var dialogue = new bondage.Dialogue();
var yarnData = JSON.parse(fs.readFileSync('yarnFile.json'));
dialogue.load(yarnData);

dialogue.on('start', function() {
    // Called before dialogue is ran
});
dialogue.on('finish', function() {
    // Called after dialogue has finished
});

dialogue.on('line', function(result) {
    // Called when a line of text should be displayed
    console.log(result.text);
});
dialogue.on('options', function(result) {
    // Called when there is a choice to be made
    // result.options is a list of options
    console.log(result.options);

    // Specify which option is chosen
    result.choose(result.options[0]);
});
dialogue.on('nodecomplete', function(result) {
    // Called when we finish a node
});

// Start the dialogue from the node titled 'NodeName'
dialogue.start('NodeName');
```
