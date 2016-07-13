module.exports = function (grunt) {
  grunt.registerTask('build', ['tslint:default', 'bower:default', 'sass:default', 'ts:default']);
}
