var Director = require('./director'),
	GameScene = require('./scenes/game'),
	PIXI = require('pixi'),
	assets = require('../data/assets'),
	utils = require('./utils'),
	Input = require('./input');

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
	this.director.setScene(new GameScene(this));
	this.director.start();
};

Game.prototype.initAndRun = function () {
	var self = this;
	this.input = new Input();
	console.log('loading assets...');
	this.loadAssets(function(remaining, total){
		console.log((total-remaining)+'/'+total);
	}, function () {
		console.log('starting...');
		self.start();
	});
};