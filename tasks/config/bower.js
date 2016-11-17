module.exports = function (grunt) {
  var path = require('path');

  grunt.config.merge({
    bower: {
      default: {
        options: {
          cleanup: true,
          targetDir: 'public/vendor',
          layout: function (type, component, source) {
            switch (type) {
              // Handle 'stylesheets' type specially for Gesso/libsass to find
              // We have to preserve the directory structure for libsass' includes
              case 'stylesheets':
                return path.dirname(source)
                  .replace('bower_components' + path.sep, '');

              // Default (byComponent) layout
              case '__untyped__':
                return component;

              // Else if type is known, add it to the component's dir
              default:
                return path.join(component, type);
            }
          },
        },
      },
    },
  });
}
