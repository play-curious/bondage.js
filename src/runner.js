'use strict';

const results = require('./results.js');

class Runner {
    constructor() {
        this.nodes = {};
    }

    /**
     * Loads the node data into this.nodes and strips out unneeded information
     * @param [object] data - Object of exported yarn JSON data
     */
    load(data) {
        for (let node of data) {
            this.nodes[node.title] = {
                'tags': node.tags,
                'body': node.body,
            };
        }
    }

    /**
     * Generator to return each sequential dialogue result starting from the given node
     * @param {string} [startNode] - The name of the node to begin at
     */
    *run(startNode) {
        var curNode = this.nodes[startNode];

        if (curNode === undefined) {
            throw new Error('Node "' + startNode + '" does not exist');
        }

        var lines = curNode.body.split('\n');

        var options = [];
        for (let line of lines) {
            // TODO: Write a real parser
            if (line.indexOf('[[') === 0) {
                // If we find an option at the beginning of the line
                // Get the node name that is between the '[[' and ']]'
                let nodeText = line.substring(line.indexOf('[[') + 2, line.indexOf(']]'));

                // Split on the | for named links
                nodeText = nodeText.split('|');

                let option = {
                    text: nodeText[0],
                    target: nodeText[1] || nodeText[0], // If there's no target, just use the text
                }

                options.push(option);
            }
            else {
                yield new results.LineResult(line);
            }
        }

        let nextNode = null;

        if (options.length > 0) {
            let result = new results.OptionsResult(options);
            let choice = null;
            result.choiceCallback = (option) => {
                choice = option;
            }

            yield result;

            nextNode = choice.target;

        }

        yield new results.NodeCompleteResult();

        if (nextNode !== null) {
            yield* this.run(nextNode);
        }
    }
}

module.exports = {
    Runner: Runner,
};
