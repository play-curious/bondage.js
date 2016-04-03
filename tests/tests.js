var chai = require('chai'),
    expect = chai.expect,
    yarn = require('../src/index.js');

const noop = () => {};

describe('Dialogue', function() {
    it('does let you create an instance with functions', function() {
        var dialogue = new yarn.Dialogue(noop, noop);

        expect(dialogue.lineCallback).to.be.a('function');
        expect(dialogue.optionsCallback).to.be.a('function');
    });
    it('does not let you create an empty instance of itself', function() {
        var createDialogue = () => { var dialogue = new yarn.Dialogue(); }

        expect(createDialogue).to.throw(TypeError);
    });
    it('does not let you define non-function callbacks', function() {
        var createDialogue = () => { var dialogue = new yarn.Dialogue(1, "hi"); }

        expect(createDialogue).to.throw(TypeError);
    });

    it('calls the line callback function if it gets a line result', function() {
        var lineCallbackCalled = false;

        var dialogue = new yarn.Dialogue(() => { lineCallbackCalled = true; },
                                         noop);

        dialogue.runner.run = () => [ new yarn.LineResult() ]

        return dialogue.start().then(() => {
            expect(lineCallbackCalled).to.be.true;
        });
    });
    it('calls the options callback function if it gets an options result', function() {
        var optionsCallbackCalled = false;

        var dialogue = new yarn.Dialogue(noop,
                                          () => { optionsCallbackCalled = true; });

        dialogue.runner.run = () => [ new yarn.OptionsResult() ]

        return dialogue.start().then(() => {
            expect(optionsCallbackCalled).to.be.true;
        });
    });
});
