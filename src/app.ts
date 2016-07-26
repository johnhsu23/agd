import * as $ from 'jquery';
import {Application} from 'backbone.marionette';
import Router from 'router';

$(() => {
  const app = new Application;

  app.on('start', () => {
    // We want to disable linting for the router since we don't really need to 
    // do anything other than instantiate it.
    // tslint:disable-next-line:no-unused-variable
    const router = new Router();
    Backbone.history.start();
  });

  app.start();
});
