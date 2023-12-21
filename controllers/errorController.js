const AppError = require('../utils/appError');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message
  });
};
const sendProdError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // if the error is programmatic(user shouldn't know the detail error)
  else {
    console.log(`Error:${err}`);
    res.statusCode(500).json({
      status: 'error',
      message: 'something went wrong'
    });
  }
};
const handleDuplicateFieldsDB = err => {
  return new AppError(`:DuplicateFieldsDB:`, 400);
};
const handleCastError = err => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleValidationError = err => {
  // const message = err.errors.email.message;
  return new AppError('ValidationError', 400);
};
const handleTokenExpiredError = err =>
  new AppError(`${err.message},please login again`, 401);
const handleJsonWebTokenError = err =>
  new AppError(`${err.message},please login again`, 401);
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    // let error = { ...err };
    // console.log(error,err)
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'validattionError') err = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError(err);
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError(err);
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(err, res);
  }
};
