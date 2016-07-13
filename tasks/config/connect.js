module.exports = function (grunt) {
  grunt.config.merge({
    connect: {
      default: {
        options: {
          base: 'public',
          livereload: true,
        }
      }
    },
  });
}
