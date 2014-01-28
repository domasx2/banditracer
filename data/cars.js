var extend = require('xtend');

var generic = {
	name:'Generic Car', 
	__serializable: true,
	sprite_name: 'cars/thunderbolt_red.png',

	physical_properties: { 
		width: 1.4,
		length: 3.26,

		//general physics properties
		linearDamping: 0.15,
		angularDamping: 0.3,
		density: 1,
		friction: 0.3,
		restitution: 0.4,
		wheels:[{x:-1, y:-1.2, width:0.4, length:0.8, revolving:true,  powered:true}, //top left
	            {x:1,  y:-1.2, width:0.4, length:0.8, revolving:true,  powered:true}, //top right
	            {x:-1, y:1.2,  width:0.4, length:0.8, revolving:false, powered:false}, //back left
	            {x:1,  y:1.2,  width:0.4, length:0.8, revolving:false, powered:false}] //back right
	},

	//car characteristics
	max_steer_angle: 0.35,
	max_speed: 100,
	power: 60
};
	

module.exports = {
	generic: extend(generic, {
		//custom attrs go here
	})
};