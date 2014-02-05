var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	levels = require('../../data/levels');

var Client = module.exports = function(world, adapter, controller) {
	this.world = world;
	this.adapter = adapter;
	this.controller = controller;
	this.time = 0;
	this.delta = 40;
	this.my_car_id = null;
	this.car = null;
	this.prevcontrols;

	//keep track of syncable objects
	this.updateable_objects = {};
	this.world.objects.on('add', function(col, obj){
		if(obj.is('syncable')){
			this.updateable_objects[obj.id] = obj;
		}
	}, this);

	this.world.objects.on('remove', function(obj){
		if(this.updateable_objects[obj.id]){
			delete this.updateable_objects[obj.id];
		}
	}, this);

	//keep track of received updates
	this.obj_data = {};
	this.prev_update_time = null;
	this.next_updates = {};

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

Client.prototype.getTargetTime = function() {
	return this.time - this.delta;
};

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

Client.prototype.proc_past_update = function(data) {
	//merge an update into previous known state
	this.prev_update_time = !this.prev_update_time ? data.t : Math.max(this.prev_update_time, data.t);
	var obj_data;
	var update;
	Object.keys(data.u).forEach(function(id){
		update = data.u[id];
		if(!this.obj_data[id]){
			obj_data = this.obj_data[id] = {};
		} else {
			obj_data = this.obj_data[id];
		}
		Object.keys(update).forEach(function(key){
			if(!obj_data[key] || obj_data[key].t < data.t){
				obj_data[key] = {
					t: data.t,
					v: update[key]
				}
			}
		}, this);
	}, this);
};

Client.prototype.handle_message_update = function (data) {
	var self = this;
	var target = this.getTargetTime();

	//update in the past - merge it into last previous known state
	if(data.t <= target){
		this.proc_past_update(data);
	//else add it to future states
	} else {
		this.next_updates[data.t] = data;
	}
};


Client.prototype.tick = function(msDuration) {
	this.time += msDuration;
	var target = this.getTargetTime();
	var next_t;

	//move future updates to the past
	Object.keys(this.next_updates).forEach(function(t){
		if(t < target) {
			this.proc_past_update(this.next_updates[t]);
			delete this.next_updates[t];
		} else {
			if(!next_t || t < next_t) {
				next_t = t;
			}
		}
	}, this);

	//no next state known, will need to simulate
	if(!next_t) {
		//console.log("nope", target);

	//next state known - merge with prev state
	} else {
		var update = this.next_updates[next_t],
			prev_data, obj, next_data, o;
		Object.keys(this.updateable_objects).forEach(function(id){
			obj = this.updateable_objects[id];
			prev_data = this.obj_data[id];
			next_data = update.u[id];
			if(next_data) {
				Object.keys(next_data).forEach(function(prop){
					if(typeof next_data[prop] === 'number' && prev_data && prev_data[prop] !== undefined) {
						o = (target - prev_data[prop].t) / (next_t - prev_data[prop].t);
						
						obj[prop] = prev_data[prop].v + (next_data[prop] - prev_data[prop].v) * o;
						//console.log(prop, o, obj[prop], prev_data[prop].v, next_data[prop]);
					} else {
						obj[prop] = next_data[prop];
					}
				}, this);
			} else {

			}
		}, this);
	}

	//if controls changed, send controls
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
			this.adapter.send('controls', data);
		}
		this.prevcontrols = sdata;
	}
};