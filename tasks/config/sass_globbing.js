module.exports = function (grunt) {
  var join = require('path').join;

  // Root of the sass files. Edit this if our SCSS files ever move around.
  var root = 'sass';

  // Read in sass_globbing config
  var globs = grunt.file.readJSON(join(root, 'sass-globbing.json'));

  // Re-key the sass-globbing.json file. The keys and values of this file are relative to the SCSS
  // source files, but we need them to be relative to the Gruntfile. To do that, we path.join() against
  // the root (see the variable above).
  var files = Object.keys(globs).reduce(function (paths, path) {
    paths[join('sass', path)] = join('sass', globs[path]);
    return paths;
  }, Object.create(null));

  grunt.config.merge({
    sass_globbing: {
      default: {
        files: files,
      },
    },
  });
};
