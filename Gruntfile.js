module.exports = function (grunt) {
  grunt.initConfig({
    bower: {
      default: {
        options: {
          layout: 'byComponent',
          targetDir: 'public/vendor',
          cleanTargetDir: true,
        },
      },
    },
    tslint: {
      default: {
        options: {
          configuration: 'tslint.json',
        },
        src: ['src/**/*.ts', '!src/baseDir.ts']
      },
    },
    ts: {
      default: {
        options: {
          failOnTypeErrors: true,
          inlineSourceMap: true,
          inlineSources: true,
        },
        tsconfig: 'src/tsconfig.json',
        outDir: 'public/lib',
      }
    },
    sass: {
      options: {
        sourceMap: true,
        soucreMapContents: true,
        sourceMapEmbed: true,
      },
      default: {
        files: {
          'public/style.css': 'sass/main.scss', 
        },
      },
    },
    connect: {
      default: {
        options: {
          base: 'public',
          livereload: true,
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      stylesheets: {
        files: ['sass/**/*.scss'],
        tasks: ['sass:default'],
      },
      typescript: {
        files: ['src/**/*.ts', '!src/.baseDir.ts'],
        tasks: ['tslint:default', 'ts:default'],
      },
      index: {
        files: 'index.html',
        tasks: [],
      },
      bower: {
        files: 'bower.json',
        tasks: ['bower:default'],
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('build', ['tslint:default', 'bower:default', 'sass:default', 'ts:default']);
  grunt.registerTask('default', ['build', 'connect:default', 'watch']);
};