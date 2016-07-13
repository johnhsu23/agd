module.exports = function (grunt) {
  var tasks = [
    'tslint:default',
    'ts:default',
    'copy:templates',
    'bower:default',
    'sass:default',
  ];

  grunt.registerTask('build', tasks);
}
