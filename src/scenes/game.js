var Renderer = require('../renderer'),
	util = require('util'),
	World = require('../engine/world'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	utils = require('../utils'),
	levels = require('../../data/levels');

var GameScene = module.exports = function GameScene(game, options) {
	this.game = game;
	this.setLevel(options.levelid);
	this.initWorld();
	this.initRenderer();
	var car = this.spawnCar(cars.generic, new controllers.KeyboardController(this.game.input), 0);
	this.renderer.follow(car);
};

GameScene.prototype.setLevel = function(levelid) {
	this.level = levels[levelid];
};

GameScene.prototype.initWorld = function(level) {
	this.world = new World(this.level.size);
	this.world.loadPropsFromLevel(this.level);
	
};

GameScene.prototype.initRenderer = function () {
	this.renderer = new Renderer(game.container, null, this.world, this.level);
};

GameScene.prototype.spawnCar = function(definition, controller, start_position ) {
	var car =  this.world.spawn('car', {
		x: this.level.start_positions[start_position].p[0] + (definition.physical_properties.width * this.world.SCALE) / 2,
		y: this.level.start_positions[start_position].p[1] + (definition.physical_properties.length * this.world.SCALE) /2,
		sprite_filename: 'cars/thunderbolt_red.png',
		angle: utils.radians(this.level.start_positions[start_position].a),
		def: definition,
	});
	car._controller = controller;
	return car;
};

GameScene.prototype.tick = function(msDuration) {
	if(this.world) {
		this.world.update(msDuration);
	}
	if(this.renderer) {
		this.renderer.render(msDuration);
	}
};


