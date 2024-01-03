const Tour = require('../models/tourModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const ApiFeatures = require('./../utils/apiFeatures');
const factory = require('./handler.js');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.GetAllTours = factory.getAll(Tour);
exports.GetTour = factory.getOne(Tour, { path: 'reviews' });
exports.UpdateTour = factory.updateOne(Tour);
exports.DeleteTour = factory.deleteOne(Tour);
exports.PostTour = factory.createOne(Tour);
exports.getTourStats = catchAsync(async (req, res) => {
  const stat = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        AverageRating: { $avg: '$ratingsAverage' },
        AveragePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        AveragePrice: -1
      }
    }
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }
    //   }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stat
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numStartTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { month: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan
    }
  });
});
