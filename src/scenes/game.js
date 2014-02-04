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
	var car = this.world.spawnCar(cars.generic, new controllers.KeyboardController(this.game.input));
	this.renderer.follow(car);
};

GameScene.prototype.setLevel = function(levelid) {
	this.level = levels[levelid];
};

GameScene.prototype.initWorld = function() {
	this.world = new World(this.level.size);
	this.world.loadLevel(this.level);
	
};

GameScene.prototype.initRenderer = function () {
	this.renderer = new Renderer(game.container, null, this.world, this.level);
};

GameScene.prototype.tick = function(msDuration) {
	if(this.world) {
		this.world.update(msDuration);
	}
	if(this.renderer) {
		this.renderer.render(msDuration);
	}
};


