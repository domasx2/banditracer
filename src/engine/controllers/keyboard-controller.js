var util = require('util'),
	BaseController = require('./base-controller');

var KeyboardController = module.exports= function (input, bindings) {
	this.input = input;
	this.bindings = bindings || {
		steer: {
			39: 1,
			37: -1
		},

		acceleration: {
			38: 1,
			40: -1
		}
	}

};

util.inherits(KeyboardController, BaseController);

BaseController.prototype._get_variable = function(fn) {
	var retv = 0;
	Object.keys(this.bindings[fn]).forEach(function(key){
		if(this.input.isDown(key)){
			retv = this.bindings[fn][key];
		}
	}, this);
	return retv;
}

BaseController.prototype.get_acceleration = function () {
	return this._get_variable('acceleration');
};

BaseController.prototype.get_steer = function () {
	return this._get_variable('steer');
};	