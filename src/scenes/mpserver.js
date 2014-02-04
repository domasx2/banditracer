var GameScene = require('./game'),
	util = require('util'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	networking = require('../networking'),
	Server = require('../engine/server');

var MPServerScene = module.exports = function MPServerScene (game, options) {
	this.game = game;
	this.options = options;
	this.setLevel(options.levelid);
	this.initWorld();
	this.adapter = new networking.PeerServer(6, this.options.gameid);
	this.server = new Server(this.world, this.adapter);
	this.initRenderer();
	this.start_pos = 0;
	var car = this.spawnCar(cars.generic, new controllers.KeyboardController(this.game.input), this.start_pos++);
	this.renderer.follow(car);
};

util.inherits(MPServerScene, GameScene);

MPServerScene.prototype.tick = function(msDuration) {
	GameScene.prototype.tick.apply(this, arguments);
	this.server.tick(msDuration);
};