var m = require('../index'),
	box2d = require('box2dweb'),
	utils = require('../../../utils');

m.c('physical', {
	x: 0,
	y: 0,
	angle : 0,
	velocity: [0, 0],

	_pos_dirty: false, //does physical body need to be updated?

	create_body: function () {
		//implement?
	},

	bootstrap: function () {
		this._body = this.create_body();
	},

	on_destroy_destroy_body: function () {
		this.world.b2world.DestroyBody(this._body);
	},


	//relay position & angle to body & vice versa
	on_update_update_body: function () {
		if(this._pos_dirty) {
			this._body.SetPositionAndAngle(new box2d.b2Vec2(this.x / this._world.SCALE, this.y / this._world.SCALE), this.angle);
			this._body.SetLinearVelocity(new box2d.b2Vec2(this.velocity[0], this.velocity[1]));
		}
	},

	on_update_after_physics_update_position: function () {
		var pos = this._body.GetPosition(), 
			x = pos.x * this._world.SCALE,
			y = pos.y * this._world.SCALE,
			angle = this._body.GetAngle(),
			vel = this._body.GetLinearVelocity().array();

		if(this.x !== x) this.x = x;
		if(this.y !== y) this.y = y;
		if(this.angle !== angle) this.angle = angle;
		if(!utils.arrayVecsEqual(vel, this.velocity)) this.velocity = vel;
		
		this._pos_dirty = false;
	},

	on_set_x: function() {
		this._pos_dirty = true;
	},

	on_set_y: function() {
		this._pos_dirty = true;
	},

	on_set_angle: function () {
		this._pos_dirty = true;
	},

	on_set_vel: function () {
		this._pos_dirty = true;
	},
	//end relay

	//physics API
	get_local_velocity: function () {
		//returns b2vec
		return this._body.GetLocalVector(this._body.GetLinearVelocityFromLocalPoint(new box2d.b2Vec2(0, 0)));
	},

	get_speed_kmh: function () {
		return (this._body.GetLinearVelocity().Length() / 1000) * 3600;
	},

	set_speed: function (speed) {
		var velocity=this._body.GetLinearVelocity();
	    velocity.Normalize();
	    velocity=new box2d.b2Vec2(velocity.x*((speed*1000.0)/3600.0),
	                              velocity.y*((speed*1000.0)/3600.0));
	    this._body.SetLinearVelocity(velocity);
	},

	//API
	teleport: function(x, y) {
		this.x = x;
		this.y = y;
	},


	//render
	on_render_set_position: function(drawable) {
		drawable.position.x = this.x;
		drawable.position.y = this.y;
		drawable.rotation  = this.angle;
	}
});