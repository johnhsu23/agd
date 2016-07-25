module.exports = function (grunt) {
  grunt.config.merge({
    watch: {
      // Watch sources
      stylesheets: {
        files: ['sass/**/*.scss'],
        tasks: ['sass:default'],
      },
      typescript: {
        files: ['src/**/*.ts', '!src/.baseDir.ts'],
        tasks: ['newer:tslint:default', 'ts:default'],
      },

      // Re-run bower if dependencies added/removed
      bower: {
        files: 'bower.json',
        tasks: ['bower:default'],
      },

      // Rebuild commentary files
      commentary: {
        files: ['commentary/*', 'commentary/**/*.html'],
        tasks: ['html-data'],
      },

      // Monitor add/delete events to update *.d.ts files
      'ambient-commentary': {
        options: {
          event: ['added', 'deleted'],
        },
        files: 'public/commentary/*.json',
        tasks: ['ambient:commentary'],
      },
      'ambient-templates': {
        options: {
          event: ['added', 'deleted'],
        },
        files: 'public/templates/*.html',
        tasks: ['ambient:templates']
      },

      // Perform livereload only when front-end scripts finish compiling
      reload: {
        options: {
          livereload: true,
        },
        files: ['public/index.html', 'public/style.css', 'public/lib/main.js']
      }
    },
  });
}
