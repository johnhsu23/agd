module.exports = function (grunt) {
  grunt.config.merge({
    svg2png: {
      default: {
        files: [{
          expand: false,
          flatten: true,
          cwd: 'public/img/bg',
          src: '*.svg',
          dest: 'public/img/bg',
        }],
      },
    },
  });
};
