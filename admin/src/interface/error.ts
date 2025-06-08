export interface ErrorResponse extends Error {
  error: CustomError;
}

export interface CustomError {
  status?: number;
  data: ErrorData;
}

export interface ErrorData {
  success: boolean;
  message: string;
  errorSources?: ErrorSources[];
  stack?: string;
}

export interface ErrorSources {
  path: string;
  message: string;
}
