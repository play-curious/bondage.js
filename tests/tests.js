const fs = require('fs'),
      chai = require('chai'),
      expect = chai.expect,
      yarn = require('../src/yarn.js');

describe('Dialogue', function() {
    var dialogue;

    var oneNodeYarnData;
    var threeNodeYarnData;
    var namedLinkYarnData;

    before(function() {
        oneNodeYarnData = JSON.parse(fs.readFileSync('./tests/yarn_files/onenode.json'));
        threeNodeYarnData = JSON.parse(fs.readFileSync('./tests/yarn_files/threenodes.json'));
        namedLinkYarnData = JSON.parse(fs.readFileSync('./tests/yarn_files/namedlink.json'));
        commandsYarnData = JSON.parse(fs.readFileSync('./tests/yarn_files/commands.json'));
    });

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

        dialogue.on('options', (result) => {
            optionsCallbackCalled = true;

            expect(result).to.be.an.instanceof(yarn.OptionsResult);
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
        dialogue.on('options', (results) => {
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
        var outputData = {
            'Start': {
                'tags': 'Tag',
                'body': 'This is a test line',
            }
        }

        expect(dialogue.runner.nodes).to.deep.equal({});

        dialogue.load(oneNodeYarnData);

        expect(dialogue.runner.nodes).to.deep.equal(outputData);
    });

    it('is able to run through some given yarn data that contains named options, when choosing the first option', function() {
        // We'll keep track of all lines to make sure they were given in order
        // Whenever options appear, we'll just say [[OPTIONS]] so we know they were displayed
        var lines = [];

        var expectedLines = [
            'This is a test line',
            'This is another test line',
            '[[OPTIONS]]',
            'This is Dest1\'s test line'
        ]

        var expectedOptions = [
            { text: 'Option1', target: 'Dest1' },
            { text: 'Option2', target: 'Dest2' },
        ]

        dialogue.load(namedLinkYarnData);

        dialogue.on('line', (result) => {
            lines.push(result.text);
        });
        dialogue.on('options', (result) => {
            lines.push('[[OPTIONS]]'); // Just to make sure they were displayed in the correct place
            expect(result.options).to.deep.equal(expectedOptions);

            result.choose(result.options[0]);
        });

        return dialogue.start().then(() => {
            expect(lines).to.deep.equal(expectedLines);
        });
    });

    it('is able to run through some given yarn data that contains options, when choosing the first option', function() {
        // We'll keep track of all lines to make sure they were given in order
        // Whenever options appear, we'll just say [[OPTIONS]] so we know they were displayed
        var lines = [];

        var expectedLines = [
            'This is a test line',
            'This is another test line',
            '[[OPTIONS]]',
            'This is Option1\'s test line'
        ]

        var expectedOptions = [
            { text: 'Option1', target: 'Option1' },
            { text: 'Option2', target: 'Option2' },
        ]

        dialogue.load(threeNodeYarnData);

        dialogue.on('line', (result) => {
            lines.push(result.text);
        });
        dialogue.on('options', (result) => {
            lines.push('[[OPTIONS]]'); // Just to make sure they were displayed in the correct place
            expect(result.options).to.deep.equal(expectedOptions);

            result.choose(result.options[0]);
        });

        return dialogue.start().then(() => {
            expect(lines).to.deep.equal(expectedLines);
        });
    });

    it('is able to run through some given yarn data that contains an option, when choosing the second option', function() {
        // We'll keep track of all lines to make sure they were given in order
        // Whenever options appear, we'll just say [[OPTIONS]] so we know they were displayed
        var lines = [];

        var expectedLines = [
            'This is a test line',
            'This is another test line',
            '[[OPTIONS]]',
            'This is Option2\'s test line'
        ]

        var expectedOptions = [
            { text: 'Option1', target: 'Option1' },
            { text: 'Option2', target: 'Option2' },
        ]

        dialogue.load(threeNodeYarnData);

        dialogue.on('line', (result) => {
            lines.push(result.text);
        });
        dialogue.on('options', (result) => {
            lines.push('[[OPTIONS]]'); // Just to make sure they were displayed in the correct place
            expect(result.options).to.deep.equal(expectedOptions);

            result.choose(result.options[1]);
        });

        return dialogue.start().then(() => {
            expect(lines).to.deep.equal(expectedLines);
        });
    });

    it('emits a nodecomplete event when it finishes parsing a node', function() {
        // We'll keep track of all lines to make sure they were given in order
        var lines = [];

        var expectedLines = [
            'This is a test line',
            'This is another test line',
            '[[NODECOMPLETE]]',
            'This is Option1\'s test line',
            '[[NODECOMPLETE]]',
        ]

        dialogue.load(threeNodeYarnData);

        dialogue.on('line', (result) => {
            lines.push(result.text);
        });
        dialogue.on('options', (result) => {
            result.choose(result.options[0]);
        });
        dialogue.on('nodecomplete', (result) => {
            lines.push('[[NODECOMPLETE]]');
        });

        return dialogue.start().then(() => {
            expect(lines).to.deep.equal(expectedLines);
        });
    });

    it('handles commands when they are inline or on their own line', function() {
        // We'll keep track of all lines to make sure they were given in order
        var lines = [];

        var expectedLines = [
            'COMMAND: command1',
            'COMMAND: command2',
            'text in between commands',
            'COMMAND: command3',
        ]

        dialogue.load(commandsYarnData);

        dialogue.on('line', (result) => {
            lines.push(result.text);
        });
        dialogue.on('command', (result) => {
            lines.push('COMMAND: ' + result.command);
        });

        return dialogue.start().then(() => {
            expect(lines).to.deep.equal(expectedLines);
        });
    });
});
