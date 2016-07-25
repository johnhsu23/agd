module.exports = function (grunt) {
  grunt.config.merge({
    ambient: {
      options: {
        prefix: 'public/',
      },
      templates: {
        files: [{
          src: 'public/templates/*.html',
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
          src: 'public/commentary/*.json',
          dest: 'src/commentary.d.ts',
        }],
      },
    },
  });
}
