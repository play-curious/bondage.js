const chai = require('chai'),
      expect = chai.expect,
      yarn = require('../src/yarn.js');

describe('Dialogue', function() {
    var dialogue;

    beforeEach(function() {
        dialogue = new yarn.Dialogue();
    });

    it('emits a line event if it gets a line result', function() {
        var lineCallbackCalled = false;

        dialogue.on('line', (result) => {
            lineCallbackCalled = true;
            expect(result).to.be.an.instanceof(yarn.LineResult);
        });

        dialogue.runner.run = () => [ new yarn.LineResult() ];

        return dialogue.start().then(() => {
            expect(lineCallbackCalled).to.be.true;
        });
    });

    it('emits an options event if it gets an options result', function() {
        var optionsCallbackCalled = false;

        dialogue.on('options', (result, chooseCallback) => {
            optionsCallbackCalled = true;
            chooseCallback(true);

            expect(result).to.be.an.instanceof(yarn.OptionsResult);
            expect(chooseCallback).to.be.an.instanceof(Function);
        });

        dialogue.runner.run = () => [ new yarn.OptionsResult() ];

        return dialogue.start().then(() => {
            expect(optionsCallbackCalled).to.be.true;
        });
    });

    it('emits a nodecomplete event if it gets an node complete result', function() {
        var nodecompleteCallbackCalled = false;

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

        dialogue.on('line', () => {
            resultsCalled.push('line');
        });
        dialogue.on('options', (results, chooseCallback) => {
            chooseCallback(true);
            resultsCalled.push('options');
        });
        dialogue.on('nodecomplete', () => {
            resultsCalled.push('nodecomplete');
        });

        dialogue.runner.run = () => [ new yarn.OptionsResult(),
                                      new yarn.NodeCompleteResult(),
                                      new yarn.LineResult() ];

        return dialogue.start().then(() => {
            expect(resultsCalled).to.deep.equal(['options', 'nodecomplete', 'line']);
        });
    });

    it('emits a start and finish result before/after other results', function() {
        var resultsCalled = [];

        dialogue.on('start', () => {
            resultsCalled.push('start');
        });
        dialogue.on('finish', () => {
            resultsCalled.push('finish');
        });
        dialogue.on('line', () => {
            resultsCalled.push('line');
        });

        dialogue.runner.run = () => [ new yarn.LineResult() ];

        return dialogue.start().then(() => {
            expect(resultsCalled).to.deep.equal(['start', 'line', 'finish']);
        });
    });

    it('is able to load yarn data into the runner', function() {
        var inputData = [
            {
                'title': 'TestNode',
                'tags': 'tag',
                'body': 'This is a test line',
                'position': {
                    'x': 50,
                    'y': 50,
                },
                'colorID': 0
            }
        ]

        var outputData = {
            'TestNode': {
                'tags': 'tag',
                'body': 'This is a test line',
            }
        }

        expect(dialogue.runner.nodes).to.deep.equal({});

        dialogue.load(inputData);

        expect(dialogue.runner.nodes).to.deep.equal(outputData);
    });
});
