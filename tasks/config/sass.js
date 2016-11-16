module.exports = function (grunt) {
  grunt.config.merge({
    sass: {
      options: {
        quiet: true,
        sourceMap: true,
        soucreMapContents: true,
        sourceMapEmbed: true,
        outputStyle: 'nested',
        includePaths: [
          'public/vendor'
        ],
      },
      default: {
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['**/*.scss'],
          dest: 'public/css',
          ext: '.css',
        }],
      },
    },
  })
}
