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
        tasks: ['newer:tslint:default', 'ts:default'],
      },
      bower: {
        files: 'bower.json',
        tasks: ['bower:default'],
      }
    },
  })
}
