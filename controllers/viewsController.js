const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
exports.getTourOverView = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  let tourName = req.params.name
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const tour = await Tour.find({ name: tourName });
  console.log(tour[0].guides);
  res.status(200).render('tour', {
    title: tour[0].name,
    tour
  });
});
