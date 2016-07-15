export default function modelProperty(name?: string): PropertyDecorator {
  return (target, key) => {
    const property = name || key as string;

    Object.defineProperty(target, property, {
      get() {
        return this.get(property);
      },
      set(value: Object) {
        this.set(property, value);
      },
    });
  };
}
