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
        tasks: ['sass_globbing:default', 'sass:default', 'postcss:default'],
      },

      // Enforce IES web standards compliance
      audit: {
        options: {
          event: ['added'],
        },
        files: ['public/**/*', '!public/vendor/**/*'],
        tasks: ['audit-filenames'],
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

      // Rebuild questions files
      questions: {
        files: ['questions/*', 'questions/**/*.html'],
        tasks: ['html-data'],
      },

      // Rebuild glossary file
      glossary: {
        files: ['glossary/*.html'],
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
      'ambient-questions': {
        options: {
          event: ['added', 'deleted'],
        },
        files: 'public/questions/*.json',
        tasks: ['ambient:questions'],
      },
      'ambient-glossary': {
        options: {
          event: ['added', 'deleted'],
        },
        files: 'public/glossary/glossary.json',
        tasks: ['ambient:glossary'],
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
