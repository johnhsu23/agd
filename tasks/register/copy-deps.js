module.exports = function (grunt) {
  // Copies D3 module dependencies from node_modules into public/vendor
  // Should be run after bower (since it cleans public/vendor for us)

  grunt.registerTask('copy-deps', 'Copies D3 module dependencies to public/vendor', runTask);

  function runTask() {
    grunt.file.expand({ cwd: 'node_modules' }, 'd3-*')
      .forEach(function (mod) {
        var src = 'node_modules/' +  mod + '/build/' + mod + '.js',
            dst = 'public/vendor/' + mod + '/' + mod + '.js';

        grunt.file.copy(src, dst);
      });
  }
}
