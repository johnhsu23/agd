module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('audit', 'Performs audits not otherwise covered by linters', ['audit-filenames']);
};
