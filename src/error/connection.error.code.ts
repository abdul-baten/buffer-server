import { EConnectionErrorMessage } from './connection.error.message';

export const ConnectionErrorCodes = Object.freeze({
  COULD_NOT_ADD: {
    error_code: 1501,
    http_code: 404,
    message: 'Whoops! Connection not found with this id.'
  },
  COULD_NOT_DELETE: {
    error_code: 1502,
    http_code: 404,
    message: 'Whoops! Connection not found with this id.'
  },
  COULD_NOT_FOUND: {
    error_code: 1500,
    http_code: 404,
    message: EConnectionErrorMessage.COULD_NOT_FOUND
  }
});
