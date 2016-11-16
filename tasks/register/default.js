module.exports = function (grunt) {
  grunt.registerTask('default', ['build', 'symlink', 'connect:default', 'watch']);
}
