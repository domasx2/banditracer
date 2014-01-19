var Renderer = require('../renderer'),
	util = require('util'),
	BaseScene = require('./base'),
	World = require('../engine/world');

var GameScene = module.exports = function GameScene(container) {
	this.world = new World([2000, 2000]);
	this.renderer = new Renderer(container, null, this.world);
};

util.inherits(GameScene, BaseScene);

GameScene.prototype.tick = function(msDuration) {
	this.world.update(msDuration);
	this.renderer.render(msDuration);
};


