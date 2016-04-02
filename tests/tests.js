var chai = require('chai'),
    expect = chai.expect,
    yarn = require('../src/index.js');

describe('DialogueRunner', function() {
    it('should let you create an instance with functions', function() {
        var dialogue = new yarn.DialogueRunner(function() { }, function() { });

        expect(dialogue.lineCallback).to.be.a('function');
        expect(dialogue.optionsCallback).to.be.a('function');
    });
    it('should not let you create an empty instance of itself', function() {
        var createDialogue = () => { var dialogue = new yarn.DialogueRunner(); }

        expect(createDialogue).to.throw(TypeError);
    });
    it('should not let you define non-function callbacks', function() {
        var createDialogue = () => { var dialogue = new yarn.DialogueRunner(1, "hi"); }

        expect(createDialogue).to.throw(TypeError);
    });
});
