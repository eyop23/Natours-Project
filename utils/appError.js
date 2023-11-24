class AppError extends Error {
  constructor(message, statusCode) {
    // called when an object is created outside this class
    super(message); // inorder to call the parent constructor and the built in error accepts only the error messages

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
