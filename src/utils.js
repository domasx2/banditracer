var box2d = require('box2dweb');

box2d.b2Vec2 = box2d.Common.Math.b2Vec2;


box2d.b2Vec2.prototype.rotate = function(angle) {
	return new box2d.b2Vec2(this.x * Math.cos(angle) - this.y * Math.sin(angle),
							this.x * Math.sin(angle) + this.y * Math.cos(angle));
}

box2d.b2Vec2.prototype.dotProd = function(vec) {
	//return (v1[0] * v2[0]) + (v1[1] * v2[1]);
	return this.x * vec.x + this.y * vec.y;
}