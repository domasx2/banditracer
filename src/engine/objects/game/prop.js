var m = require('../index'),
	box2d = require('box2dweb');

m.c('prop', {

	requires:'base physical',// drawable_sprite',

	create_body: function () {
		var def = new box2d.Dynamics.b2BodyDef();
		def.position = new box2d.b2Vec2(this.x / this._world.SCALE, this.y / this._world.SCALE);
		def.angle = this.angle;
		def.fixedRotation = true;
		var body = this._world.b2world.CreateBody(def);

		var fixdef = new box2d.Dynamics.b2FixtureDef();
		fixdef.restitution = 0.4;
		fixdef.shape = new box2d.Collision.Shapes.b2PolygonShape;
		fixdef.shape.SetAsBox(this.width / 2, this.length /2);
		body.CreateFixture(fixdef);
		return body;
	},  

	on_update_after_physics_update_position: function(){}
});