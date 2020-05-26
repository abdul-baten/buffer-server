enum ERROR_MESSAGE {
  UNAUTHORISED_ERROR = '90',
  FORBIDDEN_ERROR = '100',
  SESSION_EXPIRED_CODE = '101',
  DUPLICATE_EMAIL_ADDRESS = '102',
  EMAIL_PASSWORD_MISMATCH = '103',
  USER_WITH_THIS_EMAIL_NOT_FOUND = '104',
  INTERNAL_SERVER_ERROR = '500',
  FB_AUTH_CODE_EXPIRED_ERROR = '1000',
  FB_RIDERECT_URI_ERROR = '1001',
  FB_OAUTH_ERROR = '1002',
  FB_PAGE_ERROR = '1003',
}

const ERROR_MESSAGE_MAP = new Map([
  [
    ERROR_MESSAGE.UNAUTHORISED_ERROR,
    'Authorization failed. Please login again.',
  ],
  [ERROR_MESSAGE.FORBIDDEN_ERROR, 'Request not allowed. Please try again.'],
  [
    ERROR_MESSAGE.SESSION_EXPIRED_CODE,
    'Session has expired. Please login again.',
  ],
  [
    ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
    'This user has already an Buffer account.',
  ],
  [
    ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
    "Email address or password doesn't match.",
  ],
  [
    ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND,
    'A user with this email is not found.',
  ],
  [
    ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
    'Something bad happened. Please try again.',
  ],
  [ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR, 'Authorization code has expired.'],
  [
    ERROR_MESSAGE.FB_RIDERECT_URI_ERROR,
    'Riderct URL is missing. Please try again.',
  ],
  [
    ERROR_MESSAGE.FB_OAUTH_ERROR,
    'Could not log into Facebook. Please try again.',
  ],
  [
    ERROR_MESSAGE.FB_PAGE_ERROR,
    'Could not get Facebook Pages. Please try again.',
  ],
]);

export { ERROR_MESSAGE, ERROR_MESSAGE_MAP };
