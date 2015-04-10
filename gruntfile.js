// Generated on 2013-07-16 using generator-angular 0.3.0
'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configurable paths
    var config = {
        src: 'src',
        dist: 'dist',
        test: 'test',
        lib: 'test/lib'
    };

    grunt.initConfig({

        config: config,
        pkg: grunt.file.readJSON('package.json'),

        // Cleaning the release directory
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        // Put files not handled in minification in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.js'
                    ]
                }]
            }
        },
        // Minification uglify
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/mithril-ui-router.min.js': [
                        '<%= config.dist %>/mithril-ui-router.js'
                    ]
                },
                options: {
                    mangle:false
                }
            }
        },

        // Testing via jasmine
        jasmine: {
            src: [ '<%= config.lib %>/**/*.js' ,  '<%= config.src %>/mithril-ui-router.js'  ],
            options: {
                specs : '<%= config.test %>/**/*.js'
            }
        },

        // Testing server
        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: '.'
                }
            }
        }
    });

    //run just the tests
    grunt.registerTask('test', ['connect:test', 'jasmine' ]);
    // Build the package
    grunt.registerTask('build', [ 'clean:dist', 'copy:dist', 'uglify' ]);

};
