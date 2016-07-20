/// <reference path="../typings/index.d.ts" />

declare module 'backbone.wreqr' {
  import Wreqr = Backbone.Wreqr;
  export = Wreqr;
}

declare module 'text!templates/figure.html' {
  const content: string;
  export = content;
}

declare module 'text!templates/section.html' {
  const content: string;
  export = content;
}

declare module 'text!templates/table.html' {
  const content: string;
  export = content;
}

declare module 'text!templates/grade-switcher.html' {
  const content: string;
  export = content;
}
