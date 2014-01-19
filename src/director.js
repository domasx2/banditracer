var Director = module.exports = function Director() {
	this.scene = null;
	this.running = false;
	this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
};

Director.prototype.setScene = function(scene) {
	this.scene = scene;
}

Director.prototype.start = function () {
	this.running = true;
	this.tick(0);
};

Director.prototype.stop = function () {
	this.running = false;
};

Director.prototype.tick = function (msDuration) {
	console.log('tick', msDuration);
	if(this.running) {
		if(this.scene) {
			this.scene.tick(msDuration);
		}
		var self = this;
		this.requestAnimationFrame(function(ms){
			self.tick(ms);
		});
	}
};