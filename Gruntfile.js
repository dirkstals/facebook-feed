
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        useminPrepare: {
            options: {
                type: 'html',
                dest: 'dist'
            },
            files: {
                src: ['src/index.html', 'src/admin.html']
            }
        },

        usemin: {
            options: {
                type: 'html'
            },
            files: {
                src: ['dist/index.html', 'dist/admin.html']
            }
        },
        
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                    'dist/admin.html': 'dist/admin.html'
                }
            }
        },

        copy:{
            html: {
                expand: true, 
                cwd: 'src',
                src: ['*'], 
                dest: 'dist/',
                filter: 'isFile'
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