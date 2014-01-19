module.exports = function(grunt) {
    grunt.registerTask('compileassets', 'compile assets', function() {
        var fs = require('fs'),
            path = require('path'),
            done = this.async(),
            assets = [];

        var process = function(fpath) {
            var files = fs.readdirSync(fpath);
            files.forEach(function(fname){
                var ffpath = path.join(fpath, fname);
                if(fs.lstatSync(ffpath).isDirectory()) {
                    process(ffpath);
                } else {
                    assets.push(ffpath);
                }
            });
        };

        process('assets/images');

        fs.writeFileSync('data/assets.js', 'exports.images='+JSON.stringify(assets)+';');
        done();

    });
};