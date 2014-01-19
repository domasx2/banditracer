module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            'build/js/racer.js':['src/main.js']
        },
        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            },
            livereload: {
                options: { livereload: true },
                files: ['build/**/*']
            },
            options: {
                spawn: false
            }
        },
        connect: {
            server: {
              options: {
                port: 9000,
                keepalive: true
              }
            }
        },
        concurrent: {
            develop: ['watch', 'connect'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    //load tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-concurrent');

    //build all resources
    grunt.registerTask('build', ['browserify']);

    // start watch & server
    grunt.registerTask('develop', ['build', 'concurrent:develop']);

    grunt.registerTask('default', ['build']);
};