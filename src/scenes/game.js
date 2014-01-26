var Renderer = require('../renderer'),
	util = require('util'),
	BaseScene = require('./base'),
	World = require('../engine/world'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers');

var GameScene = module.exports = function GameScene(game) {
	this.game = game;
	this.world = new World([2000, 2000]);
	this.renderer = new Renderer(game.container, null, this.world);
	this.world.spawn('car', {
		x: 5,
		y: 5,
		sprite_filename: 'cars/thunderbolt_red.png',
		angle: 1,
		def: cars.generic,
		_controller: new controllers.KeyboardController(this.game.input)
	});
};

util.inherits(GameScene, BaseScene);

GameScene.prototype.tick = function(msDuration) {
	this.world.update(msDuration);
	this.renderer.render(msDuration);
};


