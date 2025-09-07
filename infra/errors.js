export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ message, action }) {
    super(message || "A validation error occurred.");
    this.name = "ValidationError";
    this.action = action || "Check the provided data.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Nenhum recurso foi encontrado.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Verfique se os parametros estão corretos.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super();
    this.name = "MethodNotAllowedError";
    this.action = "Please check the API documentation for the correct usage.";
    this.message = "Method Not Allowed";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Usuário não autenticado.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Faça login para realizar esta operação.";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}
