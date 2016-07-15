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
        tsconfig: 'src/tsconfig.json',
        outDir: 'public/lib',
      }
    },
  });
}
