This directory contains components related to charting.

All of them follow a D3 "generator" style, in that they are invoked like so:

```typescript
let comp = makeComponent()
  .someProperty(someValue);

this.select('g')
  .call(comp);
```

However, some components are intended to "own" a particular element, whereas some are expected to be called on an element and manage certain ones within it. The axis component is a member of the first group, but the breaks component is a member of the second group.
