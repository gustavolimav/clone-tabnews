export class InternalServerError extends Error {
  constructor({ cause, message = "An Unexpected Internal Error Happened" }) {
    super(message, { cause });
    this.name = "InternalServerError";
    this.action = "Please contact support";
    this.status_code = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.status_code,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super();
    this.name = "MethodNotAllowedError";
    this.action = "Please check the API documentation for the correct usage.";
    this.message = "Method Not Allowed";
    this.status_code = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.status_code,
    };
  }
}
