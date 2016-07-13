module.exports = function (grunt) {
  grunt.config.merge({
    tslint: {
      default: {
        options: {
          configuration: 'tslint.json',
        },
        src: ['src/**/*.ts', '!src/baseDir.ts']
      },
    },
  });
}
