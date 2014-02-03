var GameScene = require('./game'),
	util = require('util'),
	cars = require('../../data/cars'),
	controllers = require('../engine/controllers'),
	networking = require('../networking');

var MPClientScene = module.exports = function MPClientScene(game, options) {
	this.game = game;
	this.options = options;
	this.controller = new controllers.KeyboardController(this.game.input);
	game.container.empty().append('<p>Connecting...</p>');
	this.initAdapter();
};

util.inherits(MPClientScene, GameScene);

MPClientScene.prototype.initAdapter = function () {
	var self = this;
	this.adapter = new networking.PeerClient();
	this.adapter.connect(this.options.gameid);
	console.log('connecting');
	this.adapter.on('message', function(message, data){
		if(message === 'level'){
			if(!self.world) {
				self.setLevel(data.levelid);
				self.initWorld();
				self.world.time = data.time;
				self.initRenderer();
				self.adapter.send('spawns');
			}
		}

		if(message === 'event') {
			var aa = self.world.handle_event(data);
			if(aa && aa.is('car')){
				self.renderer.follow(aa);
			}
		}

		if(message === 'update') {
			var obj;
			data.u.forEach(function(update){
				obj = self.world.objects.get(update[0]);
				
				if(obj) {
					console.log('upating', obj.id, update[1]);
					Object.keys(update[1]).forEach(function(key){
						if(obj[key] !== update[1][key]){
							obj[key] = update[1][key];
						}
					});
				}
			});
		}
	});

	this.adapter.on("connected", function(){
		self.adapter.send('givelevel');
	});
};