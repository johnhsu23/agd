require.config({
  baseUrl: 'lib',
  paths: {
    templates: '../templates',
    commentary: '../commentary',

    // Shiny new d3!
    'd3-array': '../vendor/d3-array/d3-array',
    'd3-collection': '../vendor/d3-collection/d3-collection',
    'd3-color': '../vendor/d3-color/d3-color',
    'd3-dispatch': '../vendor/d3-dispatch/d3-dispatch',
    'd3-ease': '../vendor/d3-ease/d3-ease',
    'd3-interpolate': '../vendor/d3-interpolate/d3-interpolate',
    'd3-path': '../vendor/d3-path/d3-path',
    'd3-selection': '../vendor/d3-selection/d3-selection',
    'd3-shape': '../vendor/d3-shape/d3-shape',
    'd3-timer': '../vendor/d3-timer/d3-timer',
    'd3-transition': '../vendor/d3-transition/d3-transition',

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
