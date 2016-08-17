module.exports = function (grunt) {
  grunt.config.merge({
    ts: {
      default: {
        options: {
          failOnTypeErrors: true,
          inlineSourceMap: true,
          inlineSources: true,
          fast: 'never',
        },
        tsconfig: {
          tsconfig: 'src/tsconfig.json',
          passThrough: true
        },
      },
    },
  });
}
