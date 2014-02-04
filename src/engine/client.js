var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	levels = require('../../data/levels');

var Client = module.exports = function(world, adapter) {
	this.world = world;
	this.adapter = adapter;
	this.time = 0;

	var self = this;
	this.adapter
	.on('connected', function(){
		self.handle_connected.apply(self, arguments);
	})
	.on('message', function() {
		self.handle_message.apply(self, arguments);
	});
};

util.inherits(Client, EventEmitter);

Client.prototype.handle_connected = function () {
	this.adapter.send('givelevel');
};

Client.prototype.handle_message = function(message, data){
	if(this['handle_message_'+message]) {
		this['handle_message_'+message](data);
	} else {
		console.log("Client: received unknown message"+message);
	}
};

Client.prototype.handle_message_level = function (data) {
	if(!this.world.level) {
		var level = levels[data.levelid];
		if(level){
			this.world.loadLevel(level);
			this.time = data.time;
			this.emit('level_loaded');
			this.adapter.send("spawns");
		} else {
			console.log("Client: unknown level ["+data.levelid+"]");
		}
	}
};

Client.prototype.handle_message_event = function (data) {
	console.log('receive event', data);
	this.world.handle_event(data);
};

Client.prototype.handle_message_update = function (data) {
	var self = this;
	data.u.forEach(function(update){
		obj = self.world.objects.get(update[0]);
		
		if(obj) {
			Object.keys(update[1]).forEach(function(key){
				if(obj[key] !== update[1][key]){
					obj[key] = update[1][key];
				}
			});
		}
	});
};


Client.prototype.tick = function(msDuration) {
	this.time += msDuration;
};