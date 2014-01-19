var Game = require('./game'),
	$    = require('zepto-browserify').$;

$(function() {

	var game = new Game($('#container'));
});
