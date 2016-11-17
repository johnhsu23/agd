module.exports = function (grunt) {
  var fs = require('fs'),
      path = require('path');

  grunt.registerTask(
    'symlink',
    "Creates a symlink to sass/ to enable source map debugging",
    function () {
      try {
        fs.symlinkSync(path.resolve('sass'), 'public/sass', 'dir');
      } catch (e) {
        grunt.log.error(e);
      }
    }
  );
};
