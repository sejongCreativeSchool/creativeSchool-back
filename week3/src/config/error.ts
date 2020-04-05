import config from "./vars";
import httpStatus from "http-status";

class ExtendableError extends Error {
    private errors: any;
    private status: any;
    private isPublic: boolean;
    private isOperational: boolean;
  
    constructor({ message, errors, status, isPublic, stack }) {
      super(message);
      this.name = this.constructor.name;
      this.message = message;
      this.errors = errors;
      this.status = status;
      this.isPublic = isPublic;
      this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
      this.stack = stack;
      // Error.captureStackTrace(this, this.constructor.name);
    }
}
export class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({ message, errors = undefined, stack = undefined, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }) {
      super({
        message,
        errors,
        status,
        isPublic,
        stack
      });
    }
}

export const converter = (err, req , res , next ) => {
    let convertedError = err;
  
    if (!(err instanceof APIError)) {
      convertedError = new APIError({
        message: err.message,
        status: err.status,
        stack: err.stack
      });
    }
  
    return handler(convertedError, req, res);
  };
  
export const handler = (err, req, res, next?: () => void) => {
    console.log(err);
    const response = {
      code: err.status,
      message: err.message || httpStatus[err.status],
      errors: err.errors,
      stack: err.stack
    };
  
    if (config.env !== "development") {
      delete response.stack;
    }
  
    res.status(err.status);
    res.json(response);
};

export const notFound = (req, res, next) => {
    const err = new APIError({
      message: "Not found",
      status: httpStatus.NOT_FOUND
    });
    return handler(err, req, res);
};