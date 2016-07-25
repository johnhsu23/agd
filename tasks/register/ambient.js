module.exports = function (grunt) {
  var _ = require('lodash');

  var template = _.template([
    'declare module \'<%= plugin %>!<%= moduleName %>\' {',
    '<% if (preamble) { %>',
    '  <%= preamble %>',
    '<% } %>',
    '  const content: <%= type %>;',
    '  export = content;',
    '}',
  ].join('\n'));

  grunt.registerMultiTask('ambient', runTask);

  function runTask() {
    this.files.forEach(process, this);
  }

  function process(files) {
    var src = files.src,
        dest = files.dest,
        options = this.options({
          type: 'string',
          preamble: '',
          plugin: 'text',
          prefix: '',
        });

    var content = src.map(makeDeclaration, options);
    grunt.file.write(dest, content.join('\n\n') + '\n');
  }

  function makeDeclaration(filename) {
    var moduleName = filename.replace(this.prefix, ''),
        data = _.extend({ moduleName: moduleName }, this);

    return template(data);
  }
}
