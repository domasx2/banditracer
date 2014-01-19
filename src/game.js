var Director = require('./director'),
	GameScene = require('./scenes/game'),
	PIXI = require('pixi'),
	assets = require('../data/assets'),
	$    = require('zepto-browserify').$;

var Game = module.exports = function Game(container) {
	this.container = $(container);
};


Game.prototype.loadAssets = function(onProgress, onComplete) {
	var loader = new PIXI.AssetLoader(assets.images, false);
	loader.onProgress = function() {
		onProgress(loader.loadCount, assets.images.length);
	};
	loader.onComplete = onComplete;
	loader.load();
};

Game.prototype.start = function () {
	this.director = new Director();
	this.director.setScene(new GameScene(this.container));
	this.director.start();
};

Game.prototype.initAndRun = function () {
	var self = this;
	console.log('loading assets..');
	this.loadAssets(function(remaining, total){
		console.log((total-remaining)+'/'+total);
	}, function () {
		console.log('assets loaded, starting');
		self.start();
	});
};