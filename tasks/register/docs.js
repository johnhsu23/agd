module.exports = function (grunt) {
  grunt.registerTask('docs', ['clean:docs', 'typedoc:default', 'connect:docs']);
}
