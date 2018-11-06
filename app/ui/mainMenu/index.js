require('./styles.css');
var dom = require('../../utils/dom');


var playButton = dom.createDiv('button');
icon = dom.createDom('i', 'material-icons icons', playButton);
icon.innerText = 'play_arrow';

var isPaused = true;

dom.makeClickable(playButton, function togglePause() {
  isPaused = !isPaused;
  icon.innerText = isPaused ? 'play_arrow' : 'pause';
  // musicPlayer.togglePause();
});
