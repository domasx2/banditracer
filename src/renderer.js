var PIXI = require('pixi'),
	$    = require('zepto-browserify').$,
	utils = require('./utils');

var Renderer = module.exports = function Renderer(container, size, world, level) {
	this.world = world;
	this.container = container; //DOM element\
	this.drawable_cache = {};
	this.level = level;

	this.follow_target = null;

	//initialize size
	size = size || [container.width(), container.height()]; // [width,height]
	this.size = size =  [Math.min(size[0], world.size[0]), Math.min(size[1], world.size[1])];

	//init stage
	this.stage = new PIXI.Stage(0x66FF99);

	//init container
	this.object_container = new PIXI.DisplayObjectContainer();
	this.stage.addChild(this.object_container);

	//init background
	var bgtexture = Renderer.renderBackgroundTexture(level);
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

Renderer.prototype.follow = function(object){
	this.follow_target = object;
};

Renderer.prototype.updateOffset = function(){
	if(this.follow_target && this.follow_target.get_position_px) {
		pos = this.follow_target.get_position_px()
		console.log(pos, this.size);
		var x = Math.max(Math.min(pos[0] - this.size[0] / 2, this.world.size[0] - this.size[0]), 0);
		var y = Math.max(Math.min(pos[1] - this.size[1] / 2, this.world.size[1] - this.size[1]), 0);
		this.object_container.position.x = -x;
		this.object_container.position.y = -y;
	}
};


Renderer.prototype.render = function (msDuration) {
	this.updateOffset();

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

Renderer.adjustLevelPos = function (size, pos) {
	if(size[0]>size[1]) {
		return [pos[0], pos[1]+ (size[0]-size[1]) /2];
	} else if(size[1] > size[0]){
		return [pos[0] + (size[1] - size[0]) / 2, pos[1]];
	}
	return pos;
};

Renderer.renderBackgroundTexture = function(level){
	//STATIC render background
	var doc = new PIXI.DisplayObjectContainer();
	var texture = PIXI.Texture.fromImage('assets/images/backgrounds/'+level.bgtile);
	var sprite; 
	var pos;
	var x=0, y=0;
	while(x<level.size[0]){
		while(y<level.size[1]){
			sprite = new PIXI.Sprite(texture);
			sprite.position.x = x;
			sprite.position.y = y;
			doc.addChild(sprite);
			y += sprite.width;
		}
		x+= sprite.width;
		y=0;
	}
	

	level.decals.forEach(function(decal){
		texture = PIXI.Texture.fromImage('assets/images/decals/'+level.dict[decal.f]);
		sprite = new PIXI.Sprite(texture);
		//pos = Renderer.adjustLevelPos([sprite.width, sprite.height], decal.p);
		var mp = Math.max(sprite.width, sprite.height);
		sprite.position.x = decal.p[0] + mp/2;
		sprite.position.y = decal.p[1] + mp/2;
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.rotation = utils.radians(decal.a);
		sprite.pivot.x = 0.5
		sprite.pivot.y = 0.5;
		console.log(sprite.position, sprite.anchor, sprite.rotation, decal.a);
		doc.addChild(sprite);
	}, this);

	var renderTexture = new PIXI.RenderTexture(level.size[0], level.size[1]);
	renderTexture.render(doc);
	return renderTexture;
};


