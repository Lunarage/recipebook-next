// Everything wokred as expected.
export const HTTP_OK = 200;
// The request was unacceptable, often due to missing a required parameter.
export const HTTP_BAD_REQUEST = 400;
// The user is not signed in
export const HTTP_UNAUTHORIZED = 401;
// The user is signed in, but don't have permission yo access the resource.
export const HTTP_FORBIDDEN = 403;
// The requested resource doesn't exist
export const HTTP_NOT_FOUND = 404;
// The method is not allowed on the resource.
export const HTTP_METHOD_NOT_ALLOWED = 405;
// Teapot
export const HTTP_TEAPOT = 418;

// Server side error. Should not happen.
export const HTTP_INTERNAL_SERVER_ERROR = 500;
