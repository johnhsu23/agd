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
      questions: {
        options: {
          prefix: 'question',
          elements: [
            'question',
            'answer',
          ],
        },
        files: [{
          expand: true,
          src: ['questions/*'],
          filter: 'isDirectory',
          dest: 'public',
          ext: '.json',
        }],
      },
    },
  });
};
