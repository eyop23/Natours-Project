const Tour = require('../model/tourModel.js');
const ApiFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.GetAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // EXECUTING QUERY
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination(); // passing query obj n query string
    console.log(features);
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
};
exports.GetTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
};
exports.UpdateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
};
exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
};
exports.PostTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save().then.catch()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(404).json({
      error
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stat = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.7 } } },
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
      },
      {
        $match: {
          _id: { $ne: 'EASY' }
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stat
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
