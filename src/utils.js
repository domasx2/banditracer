var box2d = require('box2dweb');

box2d.b2Vec2 = box2d.Common.Math.b2Vec2;


box2d.b2Vec2.prototype.rotate = function(angle) {
	return new box2d.b2Vec2(this.x * Math.cos(angle) - this.y * Math.sin(angle),
							this.x * Math.sin(angle) + this.y * Math.cos(angle));
};

box2d.b2Vec2.prototype.array = function() {
	return [this.x, this.y];
};

box2d.b2Vec2.prototype.dotProd = function(vec) {
	//return (v1[0] * v2[0]) + (v1[1] * v2[1]);
	return this.x * vec.x + this.y * vec.y;
};

exports.arrayVecsEqual = function(a, b){
	return  a[0] === b[0] && a[1] === b[1];
};

exports.degrees = function(radians) {
	return radians * (180 / Math.PI);
};

exports.radians = function(degrees) {
	return degrees * (Math.PI / 180);
};