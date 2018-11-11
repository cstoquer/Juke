require('./styles.css');
var path = require('path');
var dom = require('../../utils/dom');
var Playlist = require('../../core/Playlist');
var fileDropper = require('../fileDropper');

var playlist = new Playlist();

var NEXT_ACTION_ICON = {
	stop: 'play_arrow',
	play: 'pause',
	pause: 'play_arrow'
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Button(parent, icon, onClick) {
	this.dom = dom.createDiv('button', parent);
	this.icon = dom.createDom('i', 'material-icons icons', this.dom);
	this.onClick = onClick || null;

	var self = this;
	dom.makeClickable(this.dom, function (e) {
		self.onClick && self.onClick(e);
	});

	if (icon) this.setIcon(icon);
}

Button.prototype.setIcon = function (icon) {
	this.icon.innerText = icon;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var playButton = new Button(null, 'play_arrow',    playlist.togglePlayPause.bind(playlist));
var skipPrev   = new Button(null, 'skip_previous', playlist.skipPrev.bind(playlist));
var skipNext   = new Button(null, 'skip_next',     playlist.skipNext.bind(playlist));

playlist.event.on('state', function (state) {
	playButton.setIcon(NEXT_ACTION_ICON[state]);
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var songs = [];
var currentSong = null;
var playlistContainer = dom.createDiv('playlist');

function playlistItemUI(item) {
	this.item = item;
	this.dom = dom.createDiv('song', playlistContainer);
	this.dom.innerText = item.name;
}

playlistItemUI.prototype.setAsCurrent = function () {
	if (currentSong) {
		currentSong.dom.style.color = '';
	}
	currentSong = this;
	this.dom.style.color = '#FF0';
};

playlist.event.on('song', function (songId) {
	songs[songId].setAsCurrent();
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function dropFile(e) {
	var files = e.dataTransfer.files;
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		// TODO: folder
		switch (path.extname(file.name)) {
			// case '.json': readJson(file); break;
			case '.mp3':
				var song = new playlistItemUI(playlist.addItem(file));
				songs.push(song);
				if (songs.length === 1) song.setAsCurrent();
				break;
		}
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TESTING
fileDropper.setdroppable(playlistContainer, {
	enter: function () { playlistContainer.style.backgroundColor = '#666' },
	leave: function () { playlistContainer.style.backgroundColor = ''},
	drop: dropFile
});
