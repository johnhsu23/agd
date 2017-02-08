require.config({
  baseUrl: 'lib',
  paths: {
    templates: '../templates',
    commentary: '../commentary',
    files: '../files',
    glossary: '../glossary',
    notes: '../notes',
    questions: '../questions',

    // Environment-specific info
    env: 'env/dev',

    // NRC scripts and fallbacks
    'nrc-header': [
      '/adminonly/themes/redesign_2015/header/header',
      'nrc-header',
    ],

    'jquery-accessibleMegaMenu': [
      '/adminonly/themes/redesign_2015/scripts/jquery-accessibleMegaMenu',
      '../vendor/Accessible-Mega-Menu/jquery-accessibleMegaMenu',
    ],

    // Shiny new d3!
    'd3-array': '../vendor/d3-array/d3-array',
    'd3-axis': '../vendor/d3-axis/d3-axis',
    'd3-collection': '../vendor/d3-collection/d3-collection',
    'd3-color': '../vendor/d3-color/d3-color',
    'd3-dispatch': '../vendor/d3-dispatch/d3-dispatch',
    'd3-dsv': '../vendor/d3-dsv/d3-dsv',
    'd3-ease': '../vendor/d3-ease/d3-ease',
    'd3-format': '../vendor/d3-format/d3-format',
    'd3-interpolate': '../vendor/d3-interpolate/d3-interpolate',
    'd3-path': '../vendor/d3-path/d3-path',
    'd3-selection': '../vendor/d3-selection/d3-selection',
    'd3-shape': '../vendor/d3-shape/d3-shape',
    'd3-scale': '../vendor/d3-scale/d3-scale',
    'd3-time': '../vendor/d3-time/d3-time',
    'd3-time-format': '../vendor/d3-time-format/d3-time-format',
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
    'jquery.selectability': '../vendor/jquery-selectability/jquery.selectability',
  },
  shim: {
    'jquery-accessibleMegaMenu': {
      deps: ['jquery'],
      exports: 'jQuery.accessibleMegaMenu',
    },
  },
});

// tslint:disable-next-line:no-require-imports
require(['jquery.selectability', 'jquery-accessibleMegaMenu', 'app']);
