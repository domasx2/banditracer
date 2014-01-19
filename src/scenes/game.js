var Renderer = require('../renderer'),
	util = require('util'),
	BaseScene = require('./base');

var GameScene = module.exports = function GameScene(container) {
	this.renderer = new Renderer(container);
};

util.inherits(GameScene, BaseScene);

GameScene.prototype.tick = function(msDuration) {
	this.renderer.render(msDuration);
};


