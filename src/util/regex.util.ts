export const REG_EX_PATTERNS = {
  // tslint:disable-next-line
  EMAIL: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  USERNAME: /^[a-zA-Z0-9]*$/,
  PASSWORD: /^[a-zA-Z0-9!@#$%^&*\-_.]*$/,
  ONE_UPPER_CASE: /[A-Z]/,
  ONE_LOWER_CASE: /[a-z]/,
  ONE_NUMBER: /[0-9]/,
  ONE_SPECIAL_CHARACTER: /^[a-zA-Z0-9_.-]*$/,
  ALLOWED_CHARACTER: /[\s]/,
  NOT_ALLOWED_REPEATING_CHARACTER: /^([a-z])\1+$/,
  WHITE_SPACE: /\s/g,
  INVITER_EMAIL_OR_CODE: /^(?:[aA-zZ0-9]{6}|\w+@\w+\.\w{2,3})$/,
  ALPHA_NUMERIC_WITH_SPACE: /^[a-z\d\s]+$/i,
  ALPHABETICAL: /[^a-zA-Z ]/g, // ALPHABETICAL input pattern
  ONE_SPACE: /\s\s+/g, // one space only pattern
  ONLY_NUMBER: /\D/g, // only numbers,
  NO_SECIAL_CHARACTER: /[&\/\\#,+()$~%.'":*?<>{}-]/g, // no special character
};
