
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },
        
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },

        copy:{
            html: {
                src: 'src/index.html', dest: 'dist/index.html'
            },
            fonts: {
                cwd: 'src/assets/fonts', src: ['**'], dest: 'dist/assets/', expand: true
            }
        },

        uglify:{
            options: {
                compress: false
            }
        }
    });

    grunt.registerTask('default', [
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'htmlmin'
    ]);

};