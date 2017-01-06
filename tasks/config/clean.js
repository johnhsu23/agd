module.exports = function (grunt) {
  grunt.config.merge({
    clean: {
      default: [
        'public/lib',
        'public/sass', // Clean up symbolic link
        'public/commentary',
        'public/glossary',
        'public/questions',
        'public/style.css',
        'public/style.css.map',

        // Generated automatically by the 'ambient' task
        'src/templates.d.ts',
        'src/commentary.d.ts',
        'src/glossary.d.ts',
        'src/questions.d.ts',

        // We don't have to clean bower_components or public/vendor:
        // 'grunt-bower-task' handles that for us
      ],
      // Clean up the docs directory
      docs: [
        'docs',
      ]
    },
  });
}
