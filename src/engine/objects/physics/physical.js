var m = require('../index');

m.c('physical', {
	x: 0,
	y: 0,
	angle : 0,

	on_render_set_position: function(drawable) {
		drawable.position.x = this.x;
		drawable.position.y = this.y;
		drawable.rotation  = this.angle;
	}
});