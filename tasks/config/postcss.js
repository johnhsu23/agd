module.exports = function (grunt) {
  grunt.config.merge({
    postcss: {
      options: {
        map: {
          inline: true,
        },
        processors: [
          require('postcss-assets')(),
          require('autoprefixer')({
            browsers: '> 1%, last 3 versions',
            // Don't remove outdated prefixes (they shouldn't be there in the first place)
            remove: false,
          }),
        ],
      },
      default: {
        src: 'public/css/*.css',
      },
    },
  });
};
