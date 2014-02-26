var GameScene = require('./game'),
	util = require('util'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	World = require('../engine/world'),
	Client = require('../engine/client'),
	networking = require('../networking');

var MPClientScene = module.exports = function MPClientScene(game, options) {
	this.game = game;
	this.options = options;
	this.controller = new controllers.KeyboardController(this.game.input);
	game.container.empty().append('<p>Connecting...</p>');
	this.adapter = new networking.PeerClient();
	this.world = new World([1000, 1000]);
	this.client = new Client(this.world, this.adapter, this.controller),
	this.adapter.connect(this.options.gameid);

	var self = this;
	this.client.on('level_loaded', function(){
		self.level = self.world.level;
		self.initRenderer();
		self.client.requestCar(cars.generic);
	}).on('yourcar', function(car){
		self.renderer.follow(car);
	});
};

util.inherits(MPClientScene, GameScene);

MPClientScene.prototype.tick = function(msDuration) {
	this.client.tick(msDuration);

	if(this.renderer) {
		this.renderer.render(msDuration);
	}
};