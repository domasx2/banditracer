var util = require('util'),
	BaseController = require('./base-controller');

var DummyController = module.exports = function() {
	this.values = {
		steer: 0,
		acceleration: 0
	};
};

util.inherits(DummyController, BaseController);

DummyController.prototype.get = function(x){
	return this.values[x];
};