var manager = require('./objects');

var World = module.exports = function World() {
	this.manager = manager.clone();
};