var audioContext = require('./audioContext');
var loadAudioBuffer = require('../loaders/loadAudioBuffer');


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioPlayer() {
  this.buffer = null;
  this.node = null;
  this._playing = false;
  this._paused = false;
  this._playbackRate = 1;
}

module.exports = AudioPlayer;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.loadFile = function (url) {
  if (this._playing) this.stop();
  this.buffer = null;
  var self = this;
  loadAudioBuffer(url, function (error, buffer) {
    if (error) return;
    self.buffer = buffer;
    self.node = audioContext.createBufferSource();
    self.node.connect(audioContext.destination);
    self.node.buffer = self.buffer;
    if (self._playing) self.node.start(0);
    if (self._paused) this.node.playbackRate.value = 0;
  });
  return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.play = function () {
  if (this._paused) {
    this._paused = false;
    this.node.playbackRate.value = this._playbackRate;
    return this;
  }
  if (this._playing) return this;
  this._playing = true;
  if (!this.buffer) return this;
  if (!this.node) {
    this.node = audioContext.createBufferSource();
    this.node.connect(audioContext.destination);
    this.node.buffer = this.buffer;
  };
  this.node.start(0);
  return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioPlayer.prototype.pause = function () {
  this._paused = true;
  if (!this._playing) return this;
  if (!this.node) return this;
  this.node.playbackRate.value = 0;
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
  this.node.onended = null;
  this.node.stop(0);
  // after stopping node, it can not be used anymore and will have to be created again
  this.node.disconnect();
  this.node = null;
  return this;
};
