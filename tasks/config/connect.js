module.exports = function (grunt) {
  grunt.config.merge({
    connect: {
      default: {
        options: {
          base: 'public',
          livereload: true,
        }
      },
      docs: {
        options: {
          keepalive: true,
          base: 'docs',
          port: 9000,
          open: true,
        },
      },
    },
  });
}
