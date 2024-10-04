'use strict'

import {Constants} from '../utils/httpStatusCode';

// Định nghĩa kiểu cho StatusCodes và ReasonPhrases nếu chưa có
const StatusCode = { ...Constants.StatusCodes };

const ReasonStatusCode = {
  ...Constants.ReasonPhrases,
};

class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.CONFLICT, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.INTERNAL_SERVER_ERROR, statusCode: number = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.CONFLICT, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.UNAUTHORIZED, statusCode: number = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.NOT_FOUND, statusCode: number = StatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.FORBIDDEN, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class TooManyRequest extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.TOO_MANY_REQUESTS, statusCode: number = StatusCode.TOO_MANY_REQUESTS) {
    super(message, statusCode);
  }
}

class RequestTooLong extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.REQUEST_TOO_LONG, statusCode: number = StatusCode.REQUEST_TOO_LONG) {
    super(message, statusCode);
  }
}

// Xuất các class theo cú pháp ES6
export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  TooManyRequest,
  RequestTooLong,
  InternalServerError,
};
