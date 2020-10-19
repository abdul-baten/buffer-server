import { EFacebookErrorMessage } from './facebook.error.message';

export const FacebookErrorCodes = Object.freeze({
  COULD_NOT_FETCH_GROUPS: {
    error_code: 1600,
    http_code: 422,
    message: EFacebookErrorMessage.COULD_NOT_FETCH_GROUPS
  },
  COULD_NOT_FETCH_PAGES: {
    error_code: 1600,
    http_code: 422,
    message: EFacebookErrorMessage.COULD_NOT_FETCH_PAGES
  },
  COULD_NOT_POST: {
    error_code: 1600,
    http_code: 422,
    message: EFacebookErrorMessage.COULD_NOT_POST
  }
});
