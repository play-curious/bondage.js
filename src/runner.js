'use strict';

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
        yield null;
    }
}

module.exports = {
    Runner: Runner,
};
