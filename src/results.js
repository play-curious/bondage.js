'use strict';

class DialogueResult {
}

class LineResult extends DialogueResult {
}

class OptionsResult extends DialogueResult {
}

class CommandResult extends DialogueResult {
}

class NodeCompleteResult extends DialogueResult {
}

module.exports = {
    LineResult: LineResult,
    OptionsResult: OptionsResult,
    CommandResult: CommandResult,
    NodeCompleteResult: NodeCompleteResult,
}
