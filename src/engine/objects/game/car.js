var m = require('../index'),
	box2d = require('box2dweb'),
	Wheel = require('./wheel'),
	extend = require('xtend'),
	constants = require('../../constants');



m.c('car', {
	requires:'base physical drawable_sprite',

	wheel_angle: 0,

	_default_controls: {
		acceleration: 0,
		steer: 0
	},


	bootstrap: function () {
		this._wheels = [];
	},

	create_body: function () {
		 //initialize body
	    var def = new box2d.Dynamics.b2BodyDef();
	    def.type = box2d.Dynamics.b2Body.b2_dynamicBody;
	    def.position = new box2d.b2Vec2(this.x / this._world.SCALE, this.y / this._world.SCALE);
	    def.angle = this.angle; 
	    def.linearDamping - this.def.physical_properties.linearDamping; 
	    def.bullet = true; 
	    def.angularDamping = this.def.physical_properties.angularDamping;
	    var body=this._world.b2world.CreateBody(def);
	    
	    //initialize shape
	    var fixdef= new box2d.Dynamics.b2FixtureDef();
	    fixdef.density = this.def.physical_properties.density;
	    fixdef.friction =  this.def.physical_properties.friction;
	    fixdef.restitution = this.def.physical_properties.restitution;
	    fixdef.shape = new box2d.Collision.Shapes.b2PolygonShape;
	    fixdef.shape.SetAsBox(this.def.physical_properties.width / 2, this.def.physical_properties.length / 2);
	    body.CreateFixture(fixdef);
	    this._body = body;
	    this.def.physical_properties.wheels.forEach(function(wheeldef) {
	    	this._wheels.push(new Wheel(extend(wheeldef, {car:this})));
	    }, this);

	    return body;
	},

	get_powered_wheels: function () {
		return this._wheels.filter(function(x){
			return x.powered;
		});
	},

	get_revolving_wheels: function () {
		return this._wheels.filter(function(x){
			return x.revolving;
		});
	},

	on_update_car: function(msDuration) {

		if(this._controller) {
			var steer = this._controller.get('steer') || 0;
			var acc = this._controller.get('acceleration') || 0;
		}

		//kill velocity
		this._wheels.forEach(function(wheel){
			wheel.killSidewaysVelocity();
		});


		//set wheel angle
		var incr = (this.def.max_steer_angle / 200) * msDuration;
		if(steer) {
			if(steer === constants.CONTROLS.STEER.RIGHT) {
				this.wheel_angle = Math.min(Math.max(this.wheel_angle, 0) + incr, this.def.max_steer_angle);
			} else {
				this.wheel_angle = Math.max(Math.min(this.wheel_angle, 0) - incr, - this.def.max_steer_angle);
			}
		} else {
			this.wheel_angle = 0;
		}


		//update revolving wheels
		this.get_revolving_wheels().forEach(function(wheel){
			wheel.setAngle(this.wheel_angle);
		}, this);

		//calc base vector
		var base_vec;
		if(acc){
			if(acc == constants.CONTROLS.ACC.FORWARD){
				if(this.get_speed_kmh() < this.def.max_speed) {
					base_vec = new box2d.b2Vec2(0, -1);
				}
			} else {
				if(this.get_local_velocity().y< 0) {
					base_vec = new box2d.b2Vec2(0, 1.3);
				} else {
					base_vec = new box2d.b2Vec2(0, 0.7);
				}
			}
		}

		//apply force to each wheel
		base_vec = base_vec || new box2d.b2Vec2(0, 0);
		base_vec.Multiply(this.def.power);
		var pos;
		this.get_powered_wheels().forEach(function(wheel){
			pos = wheel.body.GetWorldCenter();
			wheel.body.ApplyForce(wheel.body.GetWorldVector(base_vec), pos);
		}, this);

		if( (this.get_speed_kmh()<4) &&(!acc)){
            this.set_speed(0);
        }
		
	}
});