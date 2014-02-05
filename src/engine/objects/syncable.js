var m = require('./index');

m.c('syncable', {

	bootstrap: function () {
		this.clean();
		this._prev_value = {};
	},

	clean: function () {
		this._dirty = {}; 
	},

	on_set_mark_as_dirty: function(prop, val) {
		if((typeof val === 'number' || typeof val === 'string') && this._prev_value[prop] === val) {
			return;
		}
		this._dirty[prop] = true;
		this._prev_value[prop] = val;
	}
});
