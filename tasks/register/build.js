module.exports = function (grunt) {
  var tasks = [
    'tslint:default',
    'ts:default',
    'bower:default',
    'sass:default',
  ];

  grunt.registerTask('build', tasks);
}
