export interface I_ERROR {
  errorCode: string;
  errorMessage: string;
  statusCode: number;
}

export interface I_ERR {
  errorCode: string;
  errorDetails?: any;
  httpCode: number;
  message: string;
}
