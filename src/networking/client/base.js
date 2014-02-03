var BaseAdapter = require('../base');
var util = require('util');

var Base = module.exports = function () {

};

util.inherits(Base, BaseAdapter);

Base.prototype.connect = function () {
	throw new Error('implement');
};

Base.prototype.send = function(msg, data) {
	throw new Error('implement');
};

Base.prototype.disconnect = function(){
	throw new Error('disconnect');
};