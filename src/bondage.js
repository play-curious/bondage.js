'use strict';

const Dialogue = require('./dialogue.js').Dialogue;
const results = require('./results.js');

module.exports = {
  Dialogue: Dialogue,
  LineResult: results.LineResult,
  OptionsResult: results.OptionsResult,
  CommandResult: results.CommandResult,
  NodeCompleteResult: results.NodeCompleteResult,
};
