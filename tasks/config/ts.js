module.exports = function (grunt) {
  grunt.config.merge({
    ts: {
      default: {
        options: {
          failOnTypeErrors: true,
          inlineSourceMap: true,
          inlineSources: true,
        },
        tsconfig: 'src/tsconfig.json',
        outDir: 'public/lib',
      }
    },
  });
}
