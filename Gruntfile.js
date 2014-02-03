module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            'build/racer.js':['src/main.js']
        },
        emblem: {
            compile: {
              files: {
                'build/templates.js': ['templates/**/*.emblem'] //compile and concat into single file
              },
              options: {
                root: 'templates/',
                dependencies: {
                  emblem: 'lib/emblem.min.js',
                  handlebars: 'lib/handlebars.js'
                }
              }
            }
        },
        stylus: {
          compile: {
            files: {
              'build/style.css': ['stylesheets/*.styl'] // compile and concat into single file
            }
          }
        },
        watch: {
            compassets: {
                files: ['assets/images/**/*'],
                tasks: ['compileassets']
            },
            js: {
                files: ['src/**/*.js', 'data/**/*.js'],
                tasks: ['browserify']
            },
            stylus: {
                files: ['stylesheets/**/*.styl'],
                tasks: ['stylus']
            },
            emblem: {
                files: ['templates/**/*.emblem'],
                tasks: ['emblem:compile']
            },
            livereload: {
                options: { livereload: true },
                files: ['build/*', 'build/**/*']
            },
            options: {
                spawn: false
            }
        },
        connect: {
            server: {
              options: {
                hostname: "*",
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
    grunt.loadNpmTasks('grunt-emblem');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadTasks('tasks');


    //build all resources
    grunt.registerTask('build', ['compileassets', 'emblem:compile', 'stylus', 'browserify']);

    // start watch & server
    grunt.registerTask('develop', ['build', 'concurrent:develop']);

    grunt.registerTask('default', ['build']);
};