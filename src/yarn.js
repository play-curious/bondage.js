'use strict';

var Dialogue = require('./dialogue.js').Dialogue,
    results = require('./results.js')

module.exports = {
    Dialogue: Dialogue,
    LineResult: results.LineResult,
    OptionsResult: results.OptionsResult,
    CommandResult: results.CommandResult,
    NodeCompleteResult: results.NodeCompleteResult,
};
