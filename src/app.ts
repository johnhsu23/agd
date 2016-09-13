import * as $ from 'jquery';
import * as Backbone from 'backbone';
import {Application} from 'backbone.marionette';

import Router from 'router';
import RootView from 'views/root';

import 'd3-transition';

const app = new Application;

app.on('start', () => {
  // The root view listens for radio messages, so we don't
  // need to do anything with the root layout beyond instantiating it.
  // tslint:disable-next-line:no-unused-variable
  const root = new RootView;

  // We want to disable linting for the router since we don't really need to
  // do anything other than instantiate it.
  // tslint:disable-next-line:no-unused-variable
  const router = new Router();
  Backbone.history.start({
    pushState: false,
  });
});

$(() => {
  app.start();
});
