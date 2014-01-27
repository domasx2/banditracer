var m = require('../index'),
	PIXI = require('pixi');

m.c('drawable_sprite', {
	requires: 'drawable',

	sprite_filename: 'generic/sprite_placeholder.png',

	create_drawable: function(){
		var sprite =  new PIXI.Sprite(PIXI.Texture.fromImage('assets/images/'+this.sprite_filename));
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.pivot.x = 0.5;
		sprite.pivot.y = 0.5;
		return sprite;
	}
});