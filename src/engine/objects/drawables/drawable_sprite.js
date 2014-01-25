var m = require('../index'),
	PIXI = require('pixi');

m.c('drawable_sprite', {
	requires: 'drawable',

	sprite_filename: 'generic/sprite_placeholder.png',

	create_drawable: function(){
		return new PIXI.Sprite(PIXI.Texture.fromImage('assets/images/'+this.sprite_filename));
	}
});