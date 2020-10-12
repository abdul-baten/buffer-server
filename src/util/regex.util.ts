export const RegexPatterns = {
  ALLOWED_CHARACTER: /[\s]/u,
  // ALPHABETICAL input pattern
  ALPHABETICAL: /[^a-zA-Z ]/gu,
  ALPHA_NUMERIC_WITH_SPACE: /^[a-z\d\s]+$/iu,
  // eslint-disable-next-line max-len
  EMAIL: /^(("[\w\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/iu,
  // No special character
  NO_SECIAL_CHARACTER: /[&\\#,+()$~%.'":*?<>{}-]/gsu,
  ONE_LOWER_CASE: /[a-z]/u,
  ONE_NUMBER: /[0-9]/u,
  // One space only pattern
  ONE_SPACE: /\s\s+/gu,
  ONE_SPECIAL_CHARACTER: /^[a-zA-Z0-9_.-]*$/u,
  ONE_UPPER_CASE: /[A-Z]/u,
  // Only numbers,
  ONLY_NUMBER: /\D/gu,
  PASSWORD: /^[a-zA-Z0-9!@#$%^&*\-_.]*$/u,
  USERNAME: /^[a-zA-Z0-9]*$/u,
  WHITE_SPACE: /\s/gu
};
