var BaseAdapter = require('../base');
var util = require('util');

var Base = module.exports = function (max_clients) {
	this.max_clients = max_clients;
	this.client_id = 0;
};

util.inherits(Base, BaseAdapter);


Base.prototype.newClientId = function () {
	return this.client_id++;
};

Base.prototype.start = function () {
	throw new Error('implement');
};



Base.prototype.broadcast = function(message, data) {
	throw new Error('implement');
};

Base.prototype.send = function(client_id, message, data){
	throw new Error('implement');
};

Base.prototype.destroy = function(){
	this.broadcast('destroyed');
};