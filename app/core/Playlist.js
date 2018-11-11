var AudioPlayer = require('./AudioPlayer');
var Emitter     = require('nice-emitter');

var STATE = {
	STOPPED: 'stop',
	PAUSED: 'pause',
	PLAYING: 'play'
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function PlaylistItem(file) {
	this.url = file.path;
	this.name = file.name; // TODO: read id3 and get song name from metadata
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Playlist() {
	this.list = [];
	this.current = 0;
	this.musicPlayer = new AudioPlayer();
	this.state = STATE.STOPPED;

	this.musicPlayer.onEnd = this._onPlaybackEnd.bind(this);

	this.event = new Emitter();
	this.event.declareEvent('state');
	this.event.declareEvent('song');
}

module.exports = Playlist;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype.addItem = function (file) {
	var item = new PlaylistItem(file);
	if (!this.list.length) {
		// load the first song
		this.musicPlayer.loadFile(item.url);
	}
	this.list.push(item);
	return item;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype.skipPrev = function () {
	if (this.current === 0) {
		this.musicPlayer.stop().play();
		return;
	}

	this.current -= 1;

	var item = this.list[this.current];
	this.musicPlayer.loadFile(item.url);
	this.musicPlayer.play();
	this.event.emit('song', this.current);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype.skipNext = function () {
	this.current += 1;
	if (this.current >= this.list.length) {
		// TODO: auto loop
		this.current = 0;
		this._updateState(STATE.STOPPED);
		this.event.emit('song', 0);
		return;
	}

	var item = this.list[this.current];
	this.musicPlayer.loadFile(item.url);
	this.musicPlayer.play();
	this.event.emit('song', this.current);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype._updateState = function (state) {
	this.state = state;
	this.event.emit('state', state);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype._onPlaybackEnd = function () {
	this.skipNext();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Playlist.prototype.togglePlayPause = function () {
	switch (this.state) {
		case STATE.PLAYING:
			this.musicPlayer.pause();
			this._updateState(STATE.PAUSED);
			return;

		case STATE.STOPPED:
			var item = this.list[this.current];
			if (!item) return;
			this.musicPlayer.loadFile(item.url);
			this.musicPlayer.play();
			this._updateState(STATE.PLAYING);
			return;

		case STATE.PAUSED:
			this.musicPlayer.play();
			this._updateState(STATE.PLAYING);
			return;
	}
};

