import * as jsonTransformer from 'jsonata';

export class ErrorMapper {
  static facebookAuthError(error: any) {
    const interestRate = `{"errors": *.message}`;
    return jsonTransformer(interestRate).evaluate(error);
  }
}
