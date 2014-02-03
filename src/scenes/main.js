var View = require('./view');

module.exports = View.extend({
	id: 'main-scene',

	events: {
		'click [data-action="play"]': 'play',
		'click [data-action="host"]': 'host',
		'click [data-action="join"]': 'join'
	},

	play: function () {
		this.game.setScene('game', {
			levelid: 'frogfoot'
		});
	},

	getGameID: function () {
		var val = $('[name="game-id"]').val();
		if(!val){
			alert('Game id required.');
			return false;
		}
		return val;
	},

	host: function () {
		var gameid;
		if(gameid = this.getGameID()){
			this.game.setScene('mpserver', {
				levelid: 'deathvalley',
				gameid: gameid
			});
		}
	},

	join: function () {
		var gameid;
		if(gameid = this.getGameID()) {
			this.game.setScene('mpclient', {
				gameid: gameid
			});
		}
	},

	template: 'main'
});