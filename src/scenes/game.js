var Renderer = require('../renderer'),
	util = require('util'),
	BaseScene = require('./base'),
	World = require('../engine/world'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	utils = require('../utils');

var GameScene = module.exports = function GameScene(game) {
	var level = this.level = require('../../data/levels/deathvalley');
	this.game = game;
	this.world = new World(level.size);
	this.world.loadPropsFromLevel(level);
	this.renderer = new Renderer(game.container, null, this.world, level);
	var car = this.spawnCar(cars.generic, new controllers.KeyboardController(this.game.input), 0);
	this.renderer.follow(car);
};

util.inherits(GameScene, BaseScene);

GameScene.prototype.spawnCar = function(definition, controller, start_position ) {
	return this.world.spawn('car', {
		x: this.level.start_positions[start_position].p[0] + (definition.physical_properties.width * this.world.SCALE) / 2,
		y: this.level.start_positions[start_position].p[1] + (definition.physical_properties.length * this.world.SCALE) /2,
		sprite_filename: 'cars/thunderbolt_red.png',
		angle: utils.radians(this.level.start_positions[start_position].a),
		def: definition,
		_controller: controller
	});
};

GameScene.prototype.tick = function(msDuration) {
	this.world.update(msDuration);
	this.renderer.render(msDuration);
};


