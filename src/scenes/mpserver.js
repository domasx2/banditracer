var GameScene = require('./game'),
	util = require('util'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	networking = require('../networking');

var MPServerScene = module.exports = function MPServerScene (game, options) {
	this.game = game;
	this.options = options;
	this.setLevel(options.levelid);
	this.initWorld();
	this.initAdapter();
	this.initRenderer();
	this.start_pos = 0;
	this.clients = {};
	var car = this.spawnCar(cars.generic, new controllers.KeyboardController(this.game.input), this.start_pos++);
	this.renderer.follow(car);
};

util.inherits(MPServerScene, GameScene);


MPServerScene.prototype.initAdapter = function () {
	var self = this;
	this.adapter = new networking.PeerServer(6, this.options.gameid);
	this.adapter.start();
	this.adapter.on('connect', function(client_id){
		console.log('conected', client_id);
		self.clients[client_id] = {
			max_event: 0
		}
	});

	this.adapter.on('close', function(client_id){
		delete self.clients[client_id];
	});

	this.adapter.on('message', function(client_id, message, data){
		var client = self.clients[client_id];
		if(message === 'givelevel') {
			self.adapter.send(client_id, 'level', {
				levelid: self.options.levelid,
				time: self.world.time
			});
		}

		//send spawn events for live objects
		if(message === 'spawns') {
			self.world.objects.each(function(obj){
				var evt = self.world.spawn_events[obj.id];
				if(obj._sync !== false && evt){
					self.sendEvent(client_id, evt);
				}
			});
		}
	});
};

MPServerScene.prototype.sendEvent = function(client_id, evt) {
	if(this.clients[client_id]){
		this.adapter.send(client_id, 'event', evt);
		this.clients[client_id].max_event = Math.max(this.clients[client_id].max_event, evt.n);
	}
};

MPServerScene.prototype.tick = function(msDuration) {
	GameScene.prototype.tick.apply(this, arguments);
	

	//send events
	var client, self = this;;
	Object.keys(this.clients).forEach(function(client_id){
		client = self.clients[client_id];
		for(var i = client.max_event.event_no; i++; i<=self.world.event_no) {
			self.sendEvent(client_id, self.world.events[i]);
		}
	});

	//send updates
	updates = [];
	this.world.objects.each(function(obj){
		if(obj._sync !== false) {
			updates.push([obj.id, obj.__properties]);
		}
	});
	this.adapter.broadcast('update', {
		t: this.world.time,
		u: updates
	});

};