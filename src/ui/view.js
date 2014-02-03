module.exports = Backbone.View.extend({
	template: 'main',
	
	initialize: function () {
		this.render();
	},

	renderTemplate: function(context){
		return templates[this.template](context);
	},

	render: function (context) {
		this.$el.html(this.renderTemplate(context || {}));
	}
});