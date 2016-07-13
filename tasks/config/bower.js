module.exports = function (grunt) {
  grunt.config.merge({
    bower: {
      default: {
        options: {
          layout: 'byComponent',
          targetDir: 'public/vendor',
          cleanTargetDir: true,
        },
      },
    },
  });
}
