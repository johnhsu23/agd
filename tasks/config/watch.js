module.exports = function (grunt) {
  grunt.config.merge({
    watch: {
      // Watch TypeScript
      typescript: {
        files: ['src/**/*.ts', '!src/.baseDir.ts'],
        tasks: ['newer:tslint:default', 'ts:default'],
      },

      // Monitor updates to SASS or the glob config
      stylesheets: {
        files: ['sass/**/*.scss', 'sass/sass-globbing.json'],
        tasks: ['sass_globbing:default', 'sass:default', 'newer:postcss:default'],
      },

      // Re-run bower if dependencies added/removed
      bower: {
        files: 'bower.json',
        tasks: ['bower:default', 'copy-deps'],
      },

      // Rebuild commentary files
      commentary: {
        files: ['commentary/*', 'commentary/**/*.html'],
        tasks: ['html-data'],
      },

      // Convert SVG to PNG
      assets: {
        files: 'public/img/bg/*.svg',
        tasks: ['svg2png:default'],
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
        files: ['public/**/*.html', 'public/css/styles.css', 'public/lib/main.js']
      }
    },
  });
}
