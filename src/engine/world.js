var manager = require('./objects'),
	CEM = require('cem'),
	box2d = require('box2dweb');

var World = module.exports = function World(size) {
	this.size = size;
	this.SCALE = 15; //pixes in meter
	this.manager = manager.clone();
	this.objects = this.manager.e('collection');
	this.time = 0;
	this.b2world = new box2d.Dynamics.b2World(new box2d.b2Vec2(0, 0), false);
};


World.prototype.publish_event = function(event_name, data) {

	//TODO: multiplayerize this s***
	return this.handle_event({
		event:event_name,
		data: data,
		ts: this.time
	});
};

//API
World.prototype.spawn = function(entity, properties) {
	return this.publish_event('spawn', {
		entity: entity,
		properties: this.serialize_props(properties)
	});
};

World.prototype.update = function(msDuration) {
	this.time = this.time + msDuration;

	this.objects.each(function(obj){
		obj.update(msDuration);
	}, this);

	this.b2world.Step(msDuration / 1000, 10, 8);
	this.b2world.ClearForces();

	this.objects.each(function(obj) {
		obj.update_after_physics(msDuration);
	}, this);
};

//EVENT HANDLING
World.prototype.handle_event = function(msg) {
	if(this['handle_event_'+msg.event]) {
		return this['handle_event_'+msg.event](msg.data);
	} else {
		throw new Error("world.handle_event unknown event ["+msg.event+"]");
	}
};

World.prototype.handle_event_spawn = function(data) {
	var props = this.deserialize_props(data.properties), self = this;
	props._world = this;
	console.log('world:spawn ['+data.entity+']', props);
	var e = this.manager.e(data.entity, props);
	
	e.on('destroy', function(){
		self.publish_event('destroy', {id: e.id});
	});

	this.objects.add(e);
	return e;
};

World.prototype.handle_event_destroy = function(data){
	console.log('world:destroy ['+data.id+']');
};


//UTILS
World.prototype.serialize_props = function(properties) {
	var retv = {}, val, self = this;
	Object.keys(properties).forEach(function(key) {
		val = properties[key];
		if(val === self){
			return;
		} else if(val instanceof CEM.Entity) {
			val = '$E:'+val.id;
		//validate that there are no fishy props
		} else if(val === null || typeof val === 'string' || typeof val === 'number') {
			//ok
		} else if(!val.__serializable) {
			throw new Error("World.serialize_props unserializable parameter ["+key+"] type is ["+(typeof val)+"] value is ["+val+"]");
		}
		retv[key] = val;
	});
	return retv;
};

World.prototype.deserialize_props = function(properties) {
	var retv = {}, val;
	Object.keys(properties).forEach(function(key) {
		val = properties[key];
		if(typeof val === 'string' && val.slice(0, 2) === '$E') {
			val = this.objects.get(val.slice(2));
			if(!val) {
				throw new Error("deserialize_props: Object ["+val.slice(2)+"] not found");
			}
		}
		retv[key] = val;
	});
	return retv;
};


	
