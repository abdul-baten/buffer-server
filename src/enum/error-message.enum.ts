enum E_ERROR_MESSAGE {
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
  CONNECTION_DELETE_ERROR = '10000',
}

const E_ERROR_MESSAGE_MAP = new Map([
  [
    E_ERROR_MESSAGE.UNAUTHORISED_ERROR,
    'Authorization failed. Please login again.',
  ],
  [E_ERROR_MESSAGE.FORBIDDEN_ERROR, 'Request not allowed. Please try again.'],
  [
    E_ERROR_MESSAGE.SESSION_EXPIRED_CODE,
    'Session has expired. Please login again.',
  ],
  [
    E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
    'This user has already an Buffer account.',
  ],
  [
    E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
    "Email address or password doesn't match.",
  ],
  [
    E_ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND,
    'A user with this email is not found.',
  ],
  [
    E_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
    'Something bad happened. Please try again.',
  ],
  [E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR, 'Authorization code has expired.'],
  [
    E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR,
    'Riderct URL is missing. Please try again.',
  ],
  [
    E_ERROR_MESSAGE.FB_OAUTH_ERROR,
    'Could not log into Facebook. Please try again.',
  ],
  [
    E_ERROR_MESSAGE.FB_PAGE_ERROR,
    'Could not get Facebook Pages. Please try again.',
  ],
  [
    E_ERROR_MESSAGE.CONNECTION_DELETE_ERROR,
    'Could not delete connection. Please try again',
  ],
]);

export { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP };
