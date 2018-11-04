var electron = require('electron');
var Window   = require('./lib/Window');
var app      = electron.app;        // Module to control application life.
var TouchBar = electron.TouchBar;

const { TouchBarButton, TouchBarLabel, TouchBarSpacer, TouchBarSlider } = TouchBar;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var windows = {
	main: new Window('', 700, 500, 400, 350)
};

windows.main.devTool = true;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// This method will be called when Electron has finished initialization
app.on('ready', function onReady() {
  windows.main.open();

  // 🎚 🎛 ▶️ ⏸ ⏯ ⏹ ⏺ ⏭ ⏮ 🔀 🔁 🔂 🔄 🔃 🎵 🎶 💽 🎹 💾 💿 📀🎧 🎼🥁 🎷 🎺 🎸 🎻
  windows.main.browserWindow.setTouchBar(new TouchBar([
		new TouchBarButton({ label: '▶ Play', backgroundColor: '#7851A9', click: () => this.sendMessage('play') }),
		new TouchBarButton({ label: '⏮ Prev', backgroundColor: '#7851A9', click: () => this.sendMessage('previous') }),
		new TouchBarButton({ label: '⏭ Next', backgroundColor: '#7851A9', click: () => this.sendMessage('previous') }),
		new TouchBarSlider({ minValue: 0, maxValue: 1000, change: (value) => this.sendMessage('xfade', { value }) })
	]));
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});

