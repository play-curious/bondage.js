'use strict';

class DialogueResult {
}

class LineResult extends DialogueResult {
}

class OptionsResult extends DialogueResult {
}

class CommandResult extends DialogueResult {
}

class Dialogue {
    *run() {
        yield null;
    }
}

class DialogueRunner {
    /**
     * @param {function} lineCallback - Callback function for when a line needs to be displayed
     * @param {function} optionsCallback - Callback function for when a choice must be made
     * @param {function} [startCallback] - Callback function for when dialogue is started
     * @param {function} [nodeCallback] - Callback function for after a node is finished
     */
    constructor(lineCallback, optionsCallback, startCallback, nodeCallback) {
        // Make sure we get functions
        if(typeof(lineCallback) !== 'function') {
            throw TypeError('Line callback must be a function!');
        }
        if(typeof(optionsCallback) !== 'function') {
            throw TypeError('Options callback must be a function!');
        }
        if(startCallback && typeof(startCallback) !== 'function') {
            throw TypeError('If you have a start callback it must be a function!');
        }
        if(nodeCallback && typeof(nodeCallback) !== 'function') {
            throw TypeError('If you have a node callback it must be a function!');
        }

        this.lineCallback = lineCallback;
        this.optionsCallback = optionsCallback;
        this.startCallback = startCallback;
        this.nodeCallback = nodeCallback;

        this.dialogue = new Dialogue();
    }

    /**
     * @param {string} startNode - Name of the node to start the dialogue from
     * @return {Promise} - A promise to parse through and run the dialogue
     */
    run(startNode) {
        return new Promise((resolve, reject) => {
            if(this.startCallback) {
                this.startCallback();
            }

            for (let result of this.dialogue.run(startNode)) {
                if (result instanceof LineResult) {
                    this.lineCallback(result);
                }
                else if (result instanceof OptionsResult) {
                    this.optionsCallback(result);
                }
                else if (result instanceof CommandResult) {
                    // TODO: Command logic
                }
                else {
                    throw new Error('Unrecognized dialogue result: ' + result);
                }
            }
        });
    }
}

module.exports = {
    DialogueRunner: DialogueRunner,
};
