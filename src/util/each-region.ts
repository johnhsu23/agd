import {LayoutView, Region, RegionManager, View} from 'backbone.marionette';
import {Model} from 'backbone';

/**
 * Execute a callback for every region that is part of a layout view.
 */
export function eachRegion(view: LayoutView<Model>, callback: (region: Region, index: number) => void): void {
  // Ugh. The Marionette typings don't have a `regionManager' property (when they should), so we have to cheat here.
  // Time to open a PR, I suppose...
  const regionManager: RegionManager = (view as any).regionManager;

  regionManager.each(callback);
}

/**
 * Convenience function: execute a callback for every view within a layout view's regions.
 */
export function eachView(view: LayoutView<Model>, callback: (view: View<Model>, index: number) => void): void {
  eachRegion(view, (region, i) => {
    if (region.hasView()) {
      // region.currentView is typed as a Backbone view, but all of our views are Marionette views
      // (Hence the unconditional upcast.)
      const view = region.currentView as View<Model>;

      callback(view, i);
    }
  });
}
