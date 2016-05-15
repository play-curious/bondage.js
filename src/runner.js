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
    for (const node of data) {
      this.nodes[node.title] = {
        tags: node.tags,
        body: node.body,
      };
    }
  }

  /**
  * Generator to return each sequential dialogue result starting from the given node
  * @param {string} [startNode] - The name of the node to begin at
  */
  *run(startNode) {
    const curNode = this.nodes[startNode];

    if (curNode === undefined) {
      throw new Error(`Node "${startNode}" does not exist`);
    }

    const lines = curNode.body.split('\n');

    // TODO: Write a real parser
    const options = [];
    for (let line of lines) {
      let optionStartPos = line.indexOf('[[');
      let commandStartPos = line.indexOf('<<');

      // While there are still options or commands in this line
      while (optionStartPos !== -1 || commandStartPos !== -1) {
        if (optionStartPos !== -1) {
          // If we find an option get the text that is between the '[[' and ']]'
          const fullOptionText = line.substring(line.indexOf('[[') + 2, line.indexOf(']]'));

          // Split on the | for named links
          const optionText = fullOptionText.split('|');

          const option = {
            text: optionText[0],
            target: optionText[1] || optionText[0], // If there's no target, just use the text
          };

          options.push(option);

          // Remove the option text from the line
          line = line.replace(`[[${fullOptionText}]]`, '');
        }
        if (commandStartPos !== -1) {
          // If we find a command get the text that is between the '<<' and '>>'
          const commandText = line.substring(line.indexOf('<<') + 2, line.indexOf('>>'));

          yield new results.CommandResult(commandText);

          // Remove the option text from the line
          line = line.replace(`<<${commandText}>>`, '');
        }

        optionStartPos = line.indexOf('[[');
        commandStartPos = line.indexOf('<<');
      }
      if (line !== '') {
        yield new results.LineResult(line);
      }
    }

    let nextNode = null;

    if (options.length > 0) {
      const result = new results.OptionsResult(options);
      let choice = null;
      result.choiceCallback = (option) => {
        choice = option;
      };

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
