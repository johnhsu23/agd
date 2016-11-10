module.exports = function (grunt) {
  grunt.config.merge({
    sass: {
      options: {
        sourceMap: true,
        soucreMapContents: true,
        sourceMapEmbed: true,
      },
      default: {
        files: {
          'public/style.css': 'sass/styles.scss',
        },
      },
    },
  })
}
