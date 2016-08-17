module.exports = function (grunt) {
  var cheerio = require('cheerio'),
      basename = require('path').basename;

  grunt.registerMultiTask('html-data', 'Convert HTML into static data files', runTask);

  function runTask() {
    this.files.forEach(process, this);
  }

  function process(files) {
    var src = files.src[0],
        dest = files.dest,
        result = Object.create(null),
        options = this.options();

    grunt.file.recurse(src, function (path, root, prefix) {
      var data = Object.create(null);

      var key = basename(path, '.html');
      if (prefix) {
        key = prefix + '/' + key;
      }

      var $ = cheerio.load(grunt.file.read(path));
      options.elements.forEach(function (element) {
        var className = element;
        if (options.prefix) {
          className = options.prefix + '__' + element;
        }

        // Ensure we always have *some* string data to trim
        data[element] = ($('.' + className).html() || '').trim();
      });

      result[key] = data;
    });

    var json = JSON.stringify(result);
    grunt.file.write(dest, json);
  }
};
