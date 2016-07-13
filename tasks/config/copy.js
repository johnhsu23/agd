module.exports = function (grunt) {
  grunt.config.merge({
    copy: {
      templates: {
        src: 'templates/**/*.html',
        dest: 'public/',
      }
    }
  });
}
