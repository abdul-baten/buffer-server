import { EUserErrorMessage } from './user.error.message';

export const UserErrorCodes = Object.freeze({
  COULD_NOT_FOUND: {
    error_code: 600,
    http_code: 404,
    message: EUserErrorMessage.COULD_NOT_FOUND
  },
  COULD_NOT_SAVE: {
    error_code: 601,
    http_code: 404,
    message: EUserErrorMessage.COULD_NOT_SAVE
  },
  PASSWORD_MISMATCH: {
    error_code: 602,
    http_code: 404,
    message: EUserErrorMessage.PASSWORD_MISMATCH
  }
});
