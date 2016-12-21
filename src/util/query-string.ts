interface QueryValues {
  [key: string]: string;
}

/**
 * Utility function: Parse a query string into a dictionary of values.
 *
 * The properties and values will be passed to context to share with other parts of the application.
 */
export default function parse(queryString: string): QueryValues {
  const parsed = Object.create(null);
  if (!queryString) {
    return parsed;
  }

  for (const pair of queryString.split('&')) {
    const [key, value] = pair.split('=', 2);
    parsed[key] = value;
  }

  return parsed;
}
