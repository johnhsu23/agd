module.exports = function (grunt) {
  grunt.config.merge({
    watch: {
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
      },
      reload: {
        options: {
          livereload: true,
        },
        files: ['public/index.html', 'public/style.css', 'public/lib/main.js']
      }
    },
  })
}
