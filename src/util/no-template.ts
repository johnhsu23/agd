/**
 * Tells Marionette that this view does not have an associated template.
 */
export default function noTemplate<Class extends Function>(target: Class): void {
  Object.defineProperty(target.prototype, 'template', {
    value: false,
  });
}
