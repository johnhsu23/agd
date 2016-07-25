module.exports = function (grunt) {
  grunt.registerMultiTask('clean', runTask);

  function runTask() {
    this.filesSrc.forEach(clean, this);
  }

  function clean(file) {
    grunt.file.delete(file);
  }
}
