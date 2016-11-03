module.exports = function (grunt) {
  grunt.config.merge({
    tslint: {
      default: {
        options: {
          configuration: 'tslint.json',
        },
        src: ['src/**/*.ts', '!src/baseDir.ts']
      },
      production: {
        options: {
          configuration: {
            rules: {
              'no-console': [
                true,
                'assert',
                'clear',
                'count',
                'dir',
                'dirxml',
                // allow console.error() for error reporting
                'group',
                'groupCollapsed',
                'groupEnd',
                'info',
                'log',
                'profile',
                'profileEnd',
                'table',
                'time',
                'timeEnd',
                'timeStamp',
                'trace',
                'warn',
              ],
              'no-debugger': true,
            },
          },
        },
        src: ['src/**/*.ts', '!src/baseDir.ts'],
      },
    },
  });
}
