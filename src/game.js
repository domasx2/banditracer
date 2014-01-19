var Director = require('./director'),
	GameScene = require('./scenes/game');

var Game = module.exports = function Game(container) {
	this.container = container;
	this.director = new Director();
	this.director.setScene(new GameScene(container));
	this.director.start();
};