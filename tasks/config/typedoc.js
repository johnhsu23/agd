module.exports = function (grunt) {
  grunt.config.merge({
    typedoc: {
      default: {
        options: {
          module: 'amd',
          target: 'es5',
          out: 'docs',
          name: 'naep-prototype',
          tsconfig: 'src/tsconfig.json',
        },
        src: 'src/**/*.ts',
      },
    },
  });
};
