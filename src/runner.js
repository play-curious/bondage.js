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

    // Dictionary of option text -> name of destination node
    const options = {};
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

          // Put the option into the options dictionary
          // If there's no target node specified, just use the text
          options[optionText[0]] = optionText[1] || optionText[0];

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

    if (Object.keys(options).length > 0) {
      const result = new results.OptionsResult(Object.keys(options));
      let choice = null;
      result.choiceCallback = (option) => {
        // We should be given the text for the option
        choice = option;
      };

      yield result;

      if (choice === null) {
        // TODO: Can I make this so if they call next() again after choosing an option it'll still
        // work? Instead of just completely bailing on an error
        throw new Error('No option was selected');
      }

      nextNode = options[choice];

      if (nextNode === undefined) {
        throw new Error(`Invalid option selected, valid options are: ${Object.keys(options)}`);
      }
    }

    yield new results.NodeCompleteResult(startNode);

    if (nextNode !== null) {
      yield* this.run(nextNode);
    }
  }
}

module.exports = {
  Runner: Runner,
};
