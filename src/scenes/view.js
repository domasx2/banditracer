var util = require('util'),
	View = require('../ui/view');

module.exports = View.extend({

	attributes: {
		'class': 'scene-view'
	},

	initialize: function (game) {
		this.game = game;
		View.prototype.initialize.apply(this);
	},

	render: function () {
		View.prototype.render.apply(this);
		this.game.container.empty().append(this.$el);
	}
});
