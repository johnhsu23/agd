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

declare module 'text!templates/dialog.html' {
  const content: string;
  export = content;
}

declare module 'json!commentary/average-scores.json' {
  type Dict<T> = { [key: string]: T };
  const content: Dict<Dict<string>>;
  export = content;
}

declare module 'json!commentary/percentiles.json' {
  type Dict<T> = { [key: string]: T };
  const content: Dict<Dict<string>>;
  export = content;
}
