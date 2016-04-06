const chai = require('chai'),
      expect = chai.expect,
      yarn = require('../src/yarn.js');

describe('Dialogue', function() {
    it('emits a line event if it gets a line result', function() {
        var lineCallbackCalled = false;

        var dialogue = new yarn.Dialogue();

        dialogue.on('line', (result) => {
            lineCallbackCalled = true;
            expect(result).to.be.an.instanceof(yarn.LineResult);
        });

        dialogue.runner.run = () => [ new yarn.LineResult() ]

        return dialogue.start().then(() => {
            expect(lineCallbackCalled).to.be.true;
        });
    });
    it('emits an options event if it gets an options result', function() {
        var optionsCallbackCalled = false;

        var dialogue = new yarn.Dialogue();

        dialogue.on('options', (result) => {
            optionsCallbackCalled = true;
            expect(result).to.be.an.instanceof(yarn.OptionsResult);
        });

        dialogue.runner.run = () => [ new yarn.OptionsResult() ]

        return dialogue.start().then(() => {
            expect(optionsCallbackCalled).to.be.true;
        });
    });
    it('emits a nodecomplete event if it gets an node complete result', function() {
        var nodecompleteCallbackCalled = false;

        var dialogue = new yarn.Dialogue();

        dialogue.on('nodecomplete', (result) => {
            nodecompleteCallbackCalled = true;
            expect(result).to.be.an.instanceof(yarn.NodeCompleteResult);
        });

        dialogue.runner.run = () => [ new yarn.NodeCompleteResult() ];

        return dialogue.start().then(() => {
            expect(nodecompleteCallbackCalled).to.be.true;
        });
    });
    it('emits result events in order that they are given', function() {
        var resultsCalled = [];

        var dialogue = new yarn.Dialogue();

        dialogue.on('line', () => { resultsCalled.push('line'); });
        dialogue.on('options', () => { resultsCalled.push('options'); });
        dialogue.on('nodecomplete', () => { resultsCalled.push('nodecomplete'); });

        dialogue.runner.run = () => [ new yarn.OptionsResult(),
                                      new yarn.NodeCompleteResult(),
                                      new yarn.LineResult() ]

        return dialogue.start().then(() => {
            expect(resultsCalled).to.deep.equal(['options', 'nodecomplete', 'line']);
        });
    });

    it('emits a start and finish result before/after other results', function() {
        var resultsCalled = [];

        var dialogue = new yarn.Dialogue();

        dialogue.on('start', () => { resultsCalled.push('start'); });
        dialogue.on('finish', () => { resultsCalled.push('finish'); });
        dialogue.on('line', () => { resultsCalled.push('line'); });

        dialogue.runner.run = () => [ new yarn.LineResult() ]

        return dialogue.start().then(() => {
            expect(resultsCalled).to.deep.equal(['start', 'line', 'finish']);
        });
    });
});
