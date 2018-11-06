function setdroppable(element, handlers) {
  handlers = handlers || {};

  element.addEventListener('dragover', function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, false);

  element.addEventListener('dragenter', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.enter && handlers.enter(e);
  }, false);

  element.addEventListener('dragleave', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.leave && handlers.leave(e);
  }, false);

  element.addEventListener('drop', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.leave && handlers.leave(e);
    handlers.drop && handlers.drop(e);
  }, false);
}

exports.setdroppable = setdroppable;

setdroppable(document); // disable default droppable behavior.


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var AudioPlayer = require('../core/AudioPlayer');

var musicPlayer = new AudioPlayer();

function readMp3(file) {
  // TODO
  // console.log(file)
  musicPlayer
    .stop()
    .loadFile(file.path)
    .play();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function openFiles(e) {
	var files = e.dataTransfer.files;
	var file  = files[0]; // TODO: all files

	var ext = file.name.split('.').pop();

	switch (ext) {
		// case 'json': readJson(file); break;
		case 'mp3':  readMp3(file); break;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TESTING
var dom = require('../utils/dom');
var dropper = dom.createDiv('dropper');
setdroppable(dropper, {
  enter: function () { dropper.style.backgroundColor = '#666' },
  leave: function () { dropper.style.backgroundColor = ''},
  drop: openFiles
});


