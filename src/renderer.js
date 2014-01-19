var PIXI = require('pixi'),
	$    = require('zepto-browserify').$;

var Renderer = module.exports = function Renderer(container, size, world) {
	this.world = world;
	this.container = container; //DOM element

	//initialize size
	size = size || [container.width(), container.height()]; // [width,height]
	this.size = size =  [Math.min(size[0], world.size[0]), Math.min(size[1], world.size[1])];

	//init stage
	this.stage = new PIXI.Stage(0x66FF99);

	//init container
	this.object_container = new PIXI.DisplayObjectContainer();
	this.stage.addChild(this.object_container);

	//init background
	var bgtexture = Renderer.renderBackgroundTexture("assets/images/backgrounds/sand.png", this.world.size);
	var background = new PIXI.Sprite(bgtexture);
	this.object_container.addChild(background);

	//some random sprite
	var texture = PIXI.Texture.fromImage('assets/images/cars/thunderbolt_yellow.png');
	var sprite = new PIXI.Sprite(texture);
	sprite.position.x = 100;
	sprite.position.y = 100;
	this.object_container.addChild(sprite);

	//init renderer
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1]);
    this.container.empty().append(this.renderer.view);
};

Renderer.renderBackgroundTexture = function(texture, size){
	//render background
	var doc = new PIXI.DisplayObjectContainer();
	var sprite; 
	var x=0, y=0;
	while(x<size[0]){
		while(y<size[1]){
			sprite = new PIXI.Sprite(new PIXI.Texture.fromImage(texture));
			sprite.position.x = x;
			sprite.position.y = y;
			doc.addChild(sprite);
			y += sprite.width;
		}
		x+= sprite.width;
		y=0;
	}
	var renderTexture = new PIXI.RenderTexture(size[0], size[1]);
	renderTexture.render(doc);
	return renderTexture;
};

Renderer.prototype.render = function (msDuration) {
	this.renderer.render(this.stage);
};

