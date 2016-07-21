require.config({
  baseUrl: 'lib',
  paths: {
    templates: '../templates',
    commentary: '../commentary',

    // dependencies
    d3: '../vendor/d3/d3',
    json: '../vendor/requirejs-plugins/json',
    text: '../vendor/text/text',
    jquery: '../vendor/jquery/jquery',
    backbone: '../vendor/backbone/backbone',
    bluebird: '../vendor/bluebird/bluebird',
    underscore: '../vendor/underscore/underscore',
    'backbone.wreqr': '../vendor/backbone.wreqr/backbone.wreqr',
    'backbone.babysitter': '../vendor/backbone.babysitter/backbone.babysitter',
    'backbone.marionette': '../vendor/backbone.marionette/backbone.marionette',
  },
});

// tslint:disable-next-line:no-require-imports
require(['app']);
