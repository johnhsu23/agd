This directory serves two purposes:

1. It stores all page-level views (that is, any `*.ts` file in the root is guaranteed to be a view of a particular page)
2. Its subdirectories store any code that is specific to a particular page.

In general, this has the effect of creating a handful of loose things like models and specialized views for a page's sections. The intention is that the bulk of the code should be everywhere _but_ this page: large blocks of code should be abstracted out into components or behaviors.
