module.exports = function (grunt) {
  'use strict';

  /*
   * Definition of an "acceptable" file name:
   * 1. The filename consists only of alphanumeric characters, underscores, and hyphens.
   * 2. There is only one period in the filename.
   *
   * Exceptions to rule 2:
   * * Source maps
   */
  var acceptableFile = /^[-_a-zA-Z0-9]+\.[-_a-zA-Z0-9]+(?:\.map)?$/;

  /*
   * Definition of an "acceptable" directory name:
   * The directory name consists only of alphanumeric characters, underscores, and hyphes.
   */
  var acceptableDirectory = /^[-_a-zA-Z0-9]+$/;

  function audit() {
    var basename = require('path').basename,
        // We'll be scanning every file name *except* those in public/vendor (because they'll be inlined into our build)
        paths = grunt.file.expand(['public/**/*', '!public/vendor/**/*']),
        success = true;

    paths.forEach(function (path) {
      var filename = basename(path),
          isDir = grunt.file.isDir(path),
          // for reporting error messages
          type = isDir ? 'directory' : 'path',
          // which rule to use (directories can't have '.' in their names)
          regex = isDir ? acceptableDirectory : acceptableFile;

      if (!regex.test(filename)) {
        grunt.log.error('IES web standards violation for ' + type + ' ' + path);
        success = false;
      }
    });

    return success;
  }

  grunt.registerTask('audit-filenames', 'Ensures files in public/ are named according to IES web standards', audit);
};
