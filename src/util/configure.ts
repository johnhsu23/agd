type Decorator<Class extends Function, Proto> = (constructor: Class & { prototype: Proto }) => void;

/**
 * Assign values to the prototype of a class.
 *
 * @param properties An object representing a subset of properties available on a class' prototype.
 */
function configure<Props, Proto extends Props, Class extends Function>(properties: Props): Decorator<Class, Proto> {
  return constructor => {
    for (const key of Object.keys(properties)) {
      constructor.prototype[key] = (properties as any)[key];
    }
  };
}

export default configure;
export {configure, Decorator};
