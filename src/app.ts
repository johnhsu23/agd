import * as $ from 'jquery';
import * as Backbone from 'backbone';
import {Application} from 'backbone.marionette';

import Router from 'router';
import RootView from 'views/root';

import 'd3-transition';

const app = new Application;

app.on('start', () => {
  const root = new RootView;
  root.render();

  // Instantiating the router suffices here; it integrates with Backbone's history automatically.
  // tslint:disable-next-line:no-unused-new
  new Router();

  Backbone.history.start({
    pushState: false,
  });
});

$(() => {
  app.start();
});
