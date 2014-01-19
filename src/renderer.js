var PIXI = require('pixi'),
	$    = require('zepto-browserify').$;

var Renderer = module.exports = function Renderer(container, size) {
	this.container = container; //DOM element
	console.log($(window));
	this.size = size || [$(window).width(), $(window).height()]; // [width,height]
	this.stage = new PIXI.Stage(0x66FF99);
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1]);
    this.container.empty().append(this.renderer.view);
};

Renderer.prototype.render = function (msDuration) {
	this.renderer.render(this.stage);
};

