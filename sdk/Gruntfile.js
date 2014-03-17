module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            pre: [
                'dist'
            ],
            post: [
                'dist/all.css',
                'dist/compiled.js',
                'dist/compiled.min.js',
                'dist/templates.js'
            ]
        },
        concat: {
            dev: {
                src: [
                    'dist/compiled.js',
                    'dist/templates.js'
                ],
                dest: 'dist/sdk.js'
            },
            production: {
                src: [
                    'dist/compiled.min.js',
                    'dist/templates.js'
                ],
                dest: 'dist/sdk.js'
            }
        },
        cssmin: {
            dev: {
                src: 'css/*',
                dest: 'dist/all.css'
            },
            production: {
                src: 'css/*',
                dest: 'dist/all.css'
            },
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './js',
                    mainConfigFile: 'js/sdk.js',
                    name: 'sdk', // Has to be the name of the final output file for some reason.
                    optimize: 'none',
                    out: 'dist/compiled.js'
                }
            }
        },
        uglify: {
            production: {
                src: [
                    'dist/compiled.js'
                ],
                dest: 'dist/compiled.min.js'
            }
        }
    });

    grunt.registerTask('injectCSS', 'Injects CSS into the javascript as a variable.', function() {
        var before = 'var css=\'';
        var css = grunt.file.read('dist/all.css');

        css = css.replace(/'/g, '\\\'');
        css = css.replace(/\n/g, '\' +\n\'');

        var after = '\'\n';

        var sdk = grunt.file.read('dist/sdk.js');

        grunt.file.write('dist/sdk.js', before + css + after + sdk);
    });

    grunt.registerTask('default', [
        'clean:pre',
        'requirejs',
        'uglify',
        'concat:production',
        'cssmin:production',
        'injectCSS',
        'clean:post'
    ]);

    grunt.registerTask('dev', [
        'clean:pre',
        'requirejs',
        'concat:dev',
        'cssmin:dev',
        'injectCSS',
        'clean:post'
    ]);

    grunt.loadNpmTasks('grunt-contrib');
};