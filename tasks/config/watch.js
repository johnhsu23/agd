module.exports = function (grunt) {
  grunt.config.merge({
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
      templates: {
        files: ['templates/**/*.html'],
        tasks: ['copy:templates'],
      },
      bower: {
        files: 'bower.json',
        tasks: ['bower:default'],
      }
    },
  })
}