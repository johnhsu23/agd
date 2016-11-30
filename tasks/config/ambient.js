module.exports = function (grunt) {
  grunt.config.merge({
    ambient: {
      options: {
        prefix: 'public/',
      },
      templates: {
        files: [{
          src: 'public/templates/*.{css,html}',
          dest: 'src/templates.d.ts',
        }]
      },
      commentary: {
        options: {
          plugin: 'json',
          type: 'Dict<Dict<string>>',
          preamble: 'type Dict<T> = { [key: string]: T };',
        },
        files: [{
          src: 'public/commentary/**/*.json',
          dest: 'src/commentary.d.ts',
        }],
      },
      files: {
        files: [{
          src: 'public/files/*.*',
          dest: 'src/files.d.ts',
        }],
      },
      notes: {
        files: [{
          src: 'public/notes/*.*',
          dest: 'src/notes.d.ts',
        }],
      },
    },
  });
}
