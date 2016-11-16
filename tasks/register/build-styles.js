module.exports = function (grunt) {
  var tasks = [
    'sass_globbing:default',
    'sass:default',
    'postcss:default',
    'svg2png:default',
  ];

  grunt.registerTask('build-styles', tasks);
};
