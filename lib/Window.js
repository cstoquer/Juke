var path            = require('path');
var electron        = require('electron');
var BrowserWindow   = electron.BrowserWindow; // Module to create native browser window.

var DEFAULT_DIMENSIONS = {
  borderWidth: 0,
  borderHeight: 0,
  availWidth: 800,
  availHeight: 600
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Window(id, width, height, minWidth, minHeight) {
	this.id        = id;
	this.title     = null;
	this.url       = 'file://' + path.join(__dirname, '../app', this.id, 'index.html');
	this.width     = width;
	this.height    = height;
	this.minWidth  = minWidth;
	this.minHeight = minHeight;
	this.devTool   = false;

	this.browserWindow = null;
}

module.exports = Window;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Window.prototype.open = function () {
	if (this.browserWindow) return;

	var dimensions = DEFAULT_DIMENSIONS;

	var width  = Math.min(this.width  + dimensions.borderWidth,  dimensions.availWidth);
	var height = Math.min(this.height + dimensions.borderHeight, dimensions.availHeight);

	var options = {
		width:  width,
		height: height,
		title:  this.title,
		icon: __dirname + '/icons/pngs/64x64.png',
		frame: true, // add OS window border
		// webPreferences: { webSecurity: false }
	};

	if (this.minWidth)  options.minWidth  = Math.min(this.minWidth  + dimensions.borderWidth,  width);
	if (this.minHeight) options.minHeight = Math.min(this.minHeight + dimensions.borderHeight, height);


	this.browserWindow = new BrowserWindow(options);

	this.browserWindow.setMenu(null);
	this.browserWindow.loadURL(this.url);

	// mode can be: right, bottom, undocked, detach
	if (this.devTool) this.browserWindow.webContents.openDevTools({ mode: 'detach' });

	var self = this;

	this.browserWindow.on('closed', function () {
		self.browserWindow = null;
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Window.prototype.close = function () {
	if (!this.browserWindow) return;
	this.browserWindow.close();
	this.browserWindow = null;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Window.prototype.sendMessage = function (event, params = {}) {
	console.log('sendMessage', event, params)
	if (this.browserWindow) return;
	this.browserWindow.webContents.send(event, params);
};
