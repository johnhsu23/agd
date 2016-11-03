module.exports = function (grunt) {
  grunt.config.merge({
    'html-data': {
      commentary: {
        options: {
          prefix: 'section',
          elements: [
            'title',
            'subtitle',
            'commentary',
          ],
        },
        files: [{
          expand: true,
          src: ['commentary/*/*'],
          filter: 'isDirectory',
          dest: 'public',
          ext: '.json',
        }],
      },
    },
  });
};
