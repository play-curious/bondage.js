'use strict';

class Runner {
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
}
