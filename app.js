const express = require('express');
const morgan = require('morgan');
const app = express();
// 1.MiddleWare(order of middleware matters)
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log('hello middleware');
  next();
});
app.use((req, res, next) => {
  req.requetedTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', require('./routes/tours'));
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find ${req.originalUrl} on this server`
  });
});
module.exports = app;
