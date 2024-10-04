'use strict';

import {Constants} from '../utils/httpStatusCode';

// Sao chép các giá trị từ StatusCodes và ReasonPhrases
const StatusCode = { ...Constants.StatusCodes };
const ReasonStatusCode = { ...Constants.ReasonPhrases };

// Định nghĩa kiểu cho SuccessResponse constructor
interface SuccessResponseParams {
  message?: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata?: Record<string, any>; // Dạng dictionary cho metadata
}

class SuccessResponse {
  message: string;
  status: number;
  metadata: Record<string, any>;

  constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }: SuccessResponseParams) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: any, headers: Record<string, string> = {}): any {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: { message?: string; metadata?: Record<string, any> }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  options: Record<string, any>;

  constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }: { options?: Record<string, any>; message?: string; statusCode?: number; reasonStatusCode?: string; metadata?: Record<string, any> }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

// Xuất các class theo cú pháp TypeScript
export { OK, CREATED, SuccessResponse };
