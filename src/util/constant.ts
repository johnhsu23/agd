export default function constant<T>(value: T): () => T {
  return () => value;
}
