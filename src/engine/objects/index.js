var CEM = require('cem');
module.exports = new CEM.Manager();

require('./base');
require('./drawables');
require('./syncable');
require('./physics');
require('./game');