var BaseController = module.exports = function() {


};

BaseController.prototype.__serializable = true;

BaseController.prototype.get_acceleration = function () {
	return 0;
};

BaseController.prototype.get_steer = function () {
	return 0;
};	