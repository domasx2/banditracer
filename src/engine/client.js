var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	levels = require('../../data/levels');

var Client = module.exports = function(world, adapter, controller) {
	this.world = world;
	this.adapter = adapter;
	this.controller = controller;
	this.time = 0;
	this.my_car_id = null;
	this.car = null;
	this.prevcontrols;

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

Client.prototype.requestCar = function(def) {
	this.adapter.send('requestcar', def);
};

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

Client.prototype.handle_message_yourcar = function(data) {
	var car = this.world.objects.get(data);
	if(car) {
		this.emit('yourcar', car);
		this.car = car;
	} else {
		this.my_car_id = data;
	}
};

Client.prototype.handle_message_event = function (data) {
	console.log('receive event', data);
	var obj = this.world.handle_event(data);
	if(this.my_car_id && obj && obj.id === this.my_car_id) {
		this.emit('yourcar', obj);
		this.my_car_id = null;
		this.car = obj;
	}
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
	if(this.car) {
		var data = {};
		Object.keys(this.car._default_controls).forEach(function(key){
			data[key] = this.controller.get(key);
		if(data[key] === undefined) {
				data[key] = this.car._default_controls[key];
			}
		}, this);
		var sdata = JSON.stringify(data);
		if(this.prevcontrols !== sdata) {
			console.log('controls', data);
			this.adapter.send('controls', data);
		}
		this.prevcontrols = sdata;
	}
};