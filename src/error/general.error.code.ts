import { EGeneralErrorMessage } from './general.error.message';

export const GeneralErrorCodes = Object.freeze({
  SOMETHING_WENT_WRONG: {
    error_code: 1101,
    http_code: 500,
    message: EGeneralErrorMessage.SOMETHING_WENT_WRONG
  }
});
