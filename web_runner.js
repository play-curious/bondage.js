/* eslint-env browser */

var yarnTextField;
var displayArea;
var dialogue;
var dialogueIterator;
var optNum = 0;

function step() {
  // Steps until an options result
  while(true) {
    var iter = dialogueIterator.next()
    if (iter.done) {
      break;
    }

    var result = iter.value;
    if (result instanceof bondage.OptionsResult) {
      break;
    }
  }
}

function recompile() {
  displayArea.innerHTML = '';

  dialogue = new bondage.Dialogue();
  var data = JSON.parse(yarnTextField.value);
  dialogue.load(data);

  dialogue.on('line', function (result) {
    displayArea.innerHTML += result.text + '<br/>';
  });
  dialogue.on('options', function(result) {
    displayArea.innerHTML += '<br/>';
    for (var opt in result.options) {
      displayArea.innerHTML += '<input name="opt-' + optNum + '" type="radio" value="' + opt + '">' + result.options[opt] + '</input><br/>';
    }
    displayArea.innerHTML += '<input type="button" id="option-button-' + optNum + '" value="Choose"/>'
    displayArea.innerHTML += '<br/><br/>';

    var button = document.getElementById('option-button-' + optNum);
    button.onclick = function () {
      var radios = document.getElementsByName('opt-' + optNum);
      for (var n in radios) {
        var radio = radios[n];
        if (radio.checked) {
          result.choose(result.options[radio.value]);
          optNum++;
          step();
          return;
        }
      }

      console.error('Need to choose an option first!');
    }
  });

  dialogueIterator = dialogue.run()
  step();
}

function jump() {
  console.error('Not implemented yet...');
}

window.onload = function () {
  document.getElementById('recompile-button').onclick = recompile;
  document.getElementById('jump-button').onclick = jump;

  yarnTextField = document.getElementById('yarndata-text');
  displayArea = document.getElementById('display-area');
};
