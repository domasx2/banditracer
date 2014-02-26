window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var Director = module.exports = function Director() {
	this.scene = null;
	this.running = false;
	this.prev_ts = null;
};

Director.prototype.setScene = function(scene) {
	this.scene = scene;
};

Director.prototype.start = function () {
	this.running = true;
	this.tick(0);
};

Director.prototype.stop = function () {
	this.running = false;
};

Director.prototype.tick = function (timestamp) {
	var msDuration = this.prev_ts && timestamp ? timestamp - this.prev_ts: 0;
	this.prev_ts = timestamp;
	if(this.running) {
		if(this.scene && this.scene.tick) {
			this.scene.tick(msDuration);
		}
		var self = this;
		window.requestAnimationFrame(function(ts){
			self.tick(ts);
		});
	}
};