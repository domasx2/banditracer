var PIXI = require('pixi'),
	$    = require('zepto-browserify').$;

var Renderer = module.exports = function Renderer(container, size, world) {
	this.world = world;
	this.container = container; //DOM element\
	this.drawable_cache = {};

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

	//init renderer
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1]);
    this.container.empty().append(this.renderer.view);

    this.world.objects.on('remove', function(obj){
    	if(this.drawable_cache[obj.id]){
    		this.object_container.removeChild(this.drawable_cache[obj.id]);
    		delete this.drawable_cache[obj.id];
    	}
    }, this);
};

Renderer.prototype.render = function (msDuration) {
	//render all drawable objects
	this.world.objects.each(function(obj){
		if(obj.is('drawable')) {
			//initialize pixi drawable and add it to scene if it does not exist yet
			if(!this.drawable_cache[obj.id]) {
				this.drawable_cache[obj.id] = obj.create_drawable();
				this.object_container.addChild(this.drawable_cache[obj.id]);
			}
			//update pixi drawable
			obj.render(this.drawable_cache[obj.id]);
		}
	}, this);
	this.renderer.render(this.stage);
};


Renderer.renderBackgroundTexture = function(texture, size){
	//STATIC render background
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


