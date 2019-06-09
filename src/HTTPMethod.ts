export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH'
}

export const mapStringToHTTPMethod = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return HTTPMethod.GET;

    case 'POST':
      return HTTPMethod.POST;

    case 'DELETE':
      return HTTPMethod.DELETE;

    case 'PUT':
      return HTTPMethod.PUT;

    case 'PATCH':
      return HTTPMethod.PATCH;
  }

  return null;
};
