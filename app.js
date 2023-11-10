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
// app.get('/api/v1/tours', GetAllTours);
// app.post('/api/v1/tours', PostTour);
// app.get('/api/v1/tours/:id', GetTour);
// app.patch('/api/v1/tours/:id', UpdateTour);
// app.delete('/api/v1/tours/:id', DeleteTour);
// app.route('/api/v1/tours').get(GetAllTours).post(PostTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(GetTour)
//   .patch(UpdateTour)
//   .delete(DeleteTour);
app.use('/api/v1/tours', require('./routes/tours'));
module.exports = app;
