var PIXI = require('pixi'),
	$    = require('zepto-node');

var Renderer = module.exports = function Renderer(container, size) {
	this.container = container; //DOM element
	this.size = size || [$(window).width(), $(window).height()]; // [width,height]
	this.stage = new PIXI.Stage(0x66FF99);
    this.renderer = PIXI.autoDetectRenderer(size[0], size[1]);
    $(this.container).empty().append(this.renderer.view);
};

Renderer.prototype.render = function (msDuration) {
	this.renderer.render(this.stage);
};

