module.exports = function (grunt) {
  var help = 'Build an r.js-optimized package. Use --production for builds to NRC.gov';

  grunt.registerTask('optimize', help, ['build', 'requirejs']);
};
