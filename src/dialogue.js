'use strict';

const EventEmitter = require('events'),
      Runner = require('./runner.js').Runner,
      results = require('./results.js');

class Dialogue extends EventEmitter {
    constructor() {
        super();
        this.runner = new Runner();
    }

    /**
     * @param {string} startNode - Name of the node to start the dialogue from
     * @return {Promise} A promise to parse through and run the dialogue
     */
    start(startNode) {
        return new Promise((resolve, reject) => {
            this.emit('start');

            // Set up a callback for them to tell us what option they chose
            var chosenOption = null;
            var chooseCallback = (option) => { chosenOption = option; };

            for (let result of this.runner.run(startNode)) {
                if (result instanceof results.LineResult) {
                    this.emit('line', result);
                }
                else if (result instanceof results.OptionsResult) {
                    chosenOption = null; // Make sure it's reset

                    this.emit('options', result, chooseCallback);

                    if (chosenOption === null) {
                        throw new Error('You must choose an option');
                    }

                    // TODO: Process chosen option
                }
                else if (result instanceof results.CommandResult) {
                    // TODO: Command logic
                }
                else if (result instanceof results.NodeCompleteResult) {
                    this.emit('nodecomplete', result);
                }
                else {
                    throw new Error('Unrecognized dialogue result: ' + result);
                }
            }

            this.emit('finish');

            resolve();
        });
    }
}

module.exports = {
    Dialogue: Dialogue,
};
