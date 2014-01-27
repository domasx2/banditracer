var Renderer = require('../renderer'),
	util = require('util'),
	BaseScene = require('./base'),
	World = require('../engine/world'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers');

var GameScene = module.exports = function GameScene(game) {
	var level = require('../../data/levels/deathvalley');
	this.game = game;
	this.world = new World(level.size);
	this.renderer = new Renderer(game.container, null, this.world, level);
	var car = this.world.spawn('car', {
		x: 5,
		y: 5,
		sprite_filename: 'cars/thunderbolt_red.png',
		angle: 1,
		def: cars.generic,
		_controller: new controllers.KeyboardController(this.game.input)
	});
	this.renderer.follow(car);
};

util.inherits(GameScene, BaseScene);

GameScene.prototype.tick = function(msDuration) {
	this.world.update(msDuration);
	this.renderer.render(msDuration);
};


