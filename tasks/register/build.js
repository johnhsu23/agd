module.exports = function (grunt) {
  var tasks = [
    // Order matters!

    // Audit files in public/
    'audit',

    // Remove build artifacts
    'clean:default',

    // Regenerate commentary and appropriate *.d.ts files
    'html-data',
    'ambient',

    // Check & compile
    'tslint:default',
    'ts:default',

    // Reinstall dependencies
    'bower:default',
    'copy-deps',

    // Last but not least -- get our style on
    'build-styles',
  ];

  grunt.registerTask('build', tasks);
}
