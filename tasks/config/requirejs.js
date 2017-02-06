module.exports = function (grunt) {
  // We lazy-load new pages using require([]), but that means that we can't optimize them directly. We'll have to ask
  // the r.js optimizer to include them. In order to be super lazy, we just glob what's in the pages/ directory.
  // However, we have to do a small amount of legerdemain to ensure that the result is a proper r.js module name.
  var pages = grunt.file.expand({ cwd: 'public/lib' }, 'pages/*.js')
    .map(function (name) {
      return name.replace(/\.js$/, '');
    });

  grunt.config.set('requirejs', {
    default: {
      options: {
        mainConfigFile: 'public/lib/main.js',
        baseUrl: 'public/lib',
        out: 'public/lib/main.js',
        name: 'main',
        wrap: true,
        preserveLicenseComments: false,
        optimize: 'uglify2',
        include: pages,
        paths: {
          'jquery-accessibleMegaMenu': 'empty:',
          'nrc-header': 'empty:',
        },
      },
    },
  });
};
