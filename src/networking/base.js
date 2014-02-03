var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Base = module.exports = function () {

};

util.inherits(Base, EventEmitter);

Base.prototype.log = function() {
	var args = Array.prototype.slice.call(arguments);
	args.push('['+this.adapter_type+']');
	console.log(args);
};

Base.prototype.fmt_message = function(message, data){
	return {
		m: message,
		d: data 
	};
};