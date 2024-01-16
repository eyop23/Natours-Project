const path = require('path');
const express = require('express');
const morgan = require('morgan'); //logger middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const reviewRouter = require('./routes/review');
const viewsRouter = require('./routes/views');

const environment = process.env.NODE_ENV;

const app = express();
// pug temeplate for rendering
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1.GLOBAL MiddleWare(order of middleware matters)

// SERVE STATIC FILES
app.use(express.static('public'));
//SET SECURE HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (environment === 'development') {
  app.use(morgan('dev'));
}
if (environment === 'production') {
  console.log('hello production');
}

// LIMIT REQUESET FROM SAME API
const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this Ip,please try again in an a hour'
});
app.use('/api', limiter);

//BODY PARSER,READ DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION AGAINST NO SQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS(FROM INJECTING SCRIPTS TO BODY DATA)
app.use(xss());

//PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize'
    ]
  })
);

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requetedTime = new Date().toISOString();
  // console.log(x);
  // console.log(req.header);
  next();
});
// ROUTES
app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server`
  // })
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
