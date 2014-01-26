$    = require('zepto-browserify').$;

var Input = module.exports = function () {
	this.keys_down = {};
	$('body').on('keydown', $.proxy(this.onKeyDown, this));
	$('body').on('keyup', $.proxy(this.onKeyUp, this));
};

Input.prototype.onKeyDown = function(e) {
	this.keys_down[e.keyCode] = true;
};

Input.prototype.onKeyUp = function(e) {
	this.keys_down[e.keyCode] = false;
};

Input.prototype.isDown = function(key) {
	return this.keys_down[key] !== undefined ? this.keys_down[key] : false;
};