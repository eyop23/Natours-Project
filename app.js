const express = require('express');
const morgan = require('morgan'); //logger middleware
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const app = express();
// 1.MiddleWare(order of middleware matters)
console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log('hello middleware');
  next();
});
app.use((req, res, next) => {
  req.requetedTime = new Date().toISOString();
  // console.log(x);
  // console.log(req.header);
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server`
  // })
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
