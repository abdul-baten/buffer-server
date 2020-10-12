export const AuthErrorCodes = Object.freeze({
  AUTH_TOKEN_INVALID: {
    error_code: 1101,
    http_code: 400,
    message: 'Authentication token invalid or expired.'
  },
  AUTH_TOKEN_MISSING: {
    error_code: 1100,
    http_code: 403,
    message: 'Authentication token missing.'
  },
  NOT_AUTHENTICATED: {
    error_code: 1102,
    http_code: 401,
    message: 'You are not authenticated.'
  }
});
