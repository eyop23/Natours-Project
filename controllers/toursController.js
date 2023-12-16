const Tour = require('../models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const ApiFeatures = require('./../utils/apiFeatures');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.GetAllTours = catchAsync(async (req, res) => {
  // console.log(req.query);

  // EXECUTING QUERY
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination(); // passing query obj n query string
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  });
});
exports.GetTour = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'failed',
  //     Error: 'no tour with this id'
  //   });
  // }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.UpdateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.DeleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      tour: null
    }
  });
});

exports.PostTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save().then.catch()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});
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
