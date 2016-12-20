interface QueryValues {
  [key: string]: string;
}

/**
 * Utility function: Parse a query string into a dictionary of values.
 *
 * The properties and values will be passed to context to share with other parts of the application.
 */
export default function parseQueryString(queryString: string): QueryValues {
  const parsedValues: QueryValues = {};
  queryString.split('&')
    .map((string: string) =>  {
      const values = string.split('=');
      parsedValues[values[0]] = values[1];
    });

  return parsedValues;
}
