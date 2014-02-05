var controllers = require('./controllers');

var Server = module.exports = function(world, adapter) {
	this.world = world;
	this.adapter = adapter;
	this.clients = {};
	this.adapter.start();
	this.adapter
	var self = this;

	this.adapter
	.on('connect', function () {
		self.handle_connect.apply(self, arguments);
	})
	.on('close', function () {
		self.handle_close.apply(self, arguments);
	})
	.on('message', function () {
		self.handle_message.apply(self, arguments);
	});
};

/* EVENT HANDLERS */

Server.prototype.handle_connect = function (client_id){
	this.clients[client_id] = {
		max_event: 0,
		id: client_id,
		car: null
	};
};

Server.prototype.handle_close = function(client_id){
	delete this.clients[client_id];
};

Server.prototype.handle_open = function(client_id) {
	this.clients[client_id].open = true;
};

Server.prototype.handle_message = function(client_id, message, data){
	var client = this.clients[client_id];
	if(client) {
		if(this['handle_message_'+message]) {
			this['handle_message_'+message](client, data);
		} else {
			console.log('Server: unknown message ['+message+']');
		}
	}
};

/* MESSAGE HANDLERS */
Server.prototype.handle_message_givelevel = function(client, data) {
	//send level id and server time
	this.adapter.send(client.id, 'level', {
		levelid: this.world.level.id,
		time: this.world.time
	});
};

Server.prototype.handle_message_spawns = function(client, data) {
	//send spawn events for live objects
	var self = this;
	this.world.objects.each(function (obj) {
		var evt = self.world.spawn_events[obj.id];
		if(obj._sync !== false && evt){
			self.sendEvent(client.id, evt);
		}
	});
};

Server.prototype.handle_message_requestcar = function(client, def) {
	if(!client.car) {
		client.car = this.world.spawnCar(def);
		client.car._controller = new controllers.DummyController();
		this.adapter.send(client.id, "yourcar", client.car.id);
	}
};

Server.prototype.handle_message_controls = function(client, controls) {
	if(client.car && client.car._controller){
		Object.keys(controls).forEach(function(key){
			client.car._controller.values[key] = controls[key];
		});
	}
};



/* UTILS */

Server.prototype.sendEvent = function(client_id, evt) {
	if(this.clients[client_id]){
		console.log('send event', evt);
		this.adapter.send(client_id, 'event', evt);
		this.clients[client_id].max_event = Math.max(this.clients[client_id].max_event, evt.n);
	}
};

Server.prototype.tick = function(msDuration) {
		//send events
	var client, self = this;;
	Object.keys(this.clients).forEach(function(client_id){
		client = self.clients[client_id];
		for(var i = client.max_event.event_no; i++; i<=self.world.event_no) {
			self.sendEvent(client_id, self.world.events[i]);
		}
	});

	//send updates
	var updates = {}, data, keys, i, do_broadcast = false;
	this.world.objects.each(function(obj){
		if(obj.is('syncable')) {
			keys = Object.keys(obj._dirty);
			if(keys.length) {
				data = {};
				for(var i=0;i<keys.length;i++){
					data[keys[i]] = obj.__properties[keys[i]];
				}
			
				updates[obj.id] = data;
				obj.clean();
				do_broadcast = true;
			}
		}
	});

	if(do_broadcast) {
		this.adapter.broadcast('update', {
			t: this.world.time,
			u: updates
		});
	}
};