var m = require('../index'),
	PIXI = require('pixi');

m.c('drawable', {

	//apply changes to PIXI drawable object
	event_render: function (drawable) {

	},

	//return PIXI drawable object
	create_drawable: function () {
		//don't change this once initiatlized
		return  new PIXI.DisplayObjectContainer();
	},

	bootstrap: function () {
		this.create_drawable();
	}
});