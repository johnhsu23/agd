module.exports = function (grunt) {
  var tasks = [
    'tslint:default',
    'ts:default',
    'bower:default',
    'sass:default',
    'html-data',
  ];

  grunt.registerTask('build', tasks);
}
