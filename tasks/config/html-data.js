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
            'footer',
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
      glossary: {
        options: {
          prefix: 'glossary',
          elements: [
            'title',
            'description',
          ],
        },
        files: [{
          expand: true,
          src: ['glossary'],
          filter: 'isDirectory',
          dest: 'public/glossary',
          ext: '.json',

        }]
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
