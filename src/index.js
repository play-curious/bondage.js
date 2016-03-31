'use strict';

class DialogueRunner {
    constructor(lineCallback, optionsCallback) {
        // Make sure we either got two functions
        if(typeof(lineCallback) !== 'function') {
            throw TypeError('Line callback must be a function!');
        }
        if(typeof(optionsCallback) !== 'function') {
            throw TypeError('Options callback must be a function!');
        }

        this.lineCallback = lineCallback;
        this.optionsCallback = optionsCallback;
    }
};

module.exports = DialogueRunner;
