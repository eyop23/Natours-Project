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
  const message = err.keyValue.name;
  return new AppError(message, 400);
};
const handleCastError = err => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if ((error.name = 'validationError')) error = handleValidationError(error);

    sendDevError(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(err, res);
  }
};
