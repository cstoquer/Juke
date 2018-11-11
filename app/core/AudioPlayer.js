var audioContext = require('./audioContext');
var loadAudioBuffer = require('../loaders/loadAudioBuffer');


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioPlayer() {
	this.buffer = null;
	this.node = null;
	this._playing = false;
	this._paused = false;
	this._playbackRate = 1;
	this.onEnd = null;
}

module.exports = AudioPlayer;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.loadFile = function (url) {
	// this.stop();
	if (this.node) {
		this.node.stop(0);
		this.node.disconnect();
		this.node.onended = null;
		this.node = null;
	}

	this.buffer = null;
	var self = this;
	loadAudioBuffer(url, function (error, buffer) {
		if (error) return console.error(error);
		self.buffer = buffer;
		if (self._playing) self._createBufferSourceAndPlay();
	});
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype._createBufferSourceAndPlay = function () {
	if (!this.buffer) return this;

	var self = this;

	this.node = audioContext.createBufferSource();
	this.node.connect(audioContext.destination);
	this.node.buffer = this.buffer;
	this.node.playbackRate.value = this._paused ? 0 : this._playbackRate;

	this.node.onended = function () {
		self.stop();
		self.onEnd && self.onEnd();
	}

	this.node.start(0);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.play = function () {
	// unpause
	if (this._paused) {
		this._paused = false;
		if (this.node) this.node.playbackRate.value = this._playbackRate;
		return this;
	}

	// already playing
	if (this._playing) return this;

	// start playback
	this._playing = true;
	this._createBufferSourceAndPlay();
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.pause = function () {
	this._paused = true;
	if (this.node) this.node.playbackRate.value = 0;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.togglePause = function () {
	if (this._paused) this.play();
	else this.pause();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.stop = function () {
	if (!this._playing) return this;
	this._playing = false;
	this._paused = false;
	this.node.onended = null;
	this.node.stop(0);
	// after stopping node, it can not be used anymore and will have to be created again
	this.node.disconnect();
	this.node = null;
	return this;
};
