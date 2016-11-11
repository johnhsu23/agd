interface JQuery {
  accessibleMegaMenu(options?: AccessibleMegaMenuOptions): JQuery;
}

interface AccessibleMegaMenuOptions {
  uuidPrefix?: string;
  menuClass?: string;
  topNavItemClass?: string;
  panelClass?: string;
  panelGroupClass?: string;
  hoverClass?: string;
  focusClass?: string;
  openClass?: string;
}
