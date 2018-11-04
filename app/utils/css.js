var fs = require('fs-extra');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// make require css create a css style
require.extensions['.css'] = function (module, filename) {
	var element = document.createElement('style');
	element.type = 'text/css';
	var textNode = document.createTextNode(fs.readFileSync(filename, 'utf8'));
	element.appendChild(textNode);
	document.getElementsByTagName('head')[0].appendChild(element);
	module.exports = null;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// make require html returns text content
require.extensions['.html'] = function (module, filename) {
	var html = fs.readFileSync(filename, 'utf8');
	module.exports = html;
};
