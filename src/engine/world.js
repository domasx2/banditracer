var manager = require('./objects');

var World = module.exports = function World(size) {
	this.size = size;
	this.manager = manager.clone();
	this.objects = this.manager.e('collection');
};

World.prototype.update = function(msDuration) {

};