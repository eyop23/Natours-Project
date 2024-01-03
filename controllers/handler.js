const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: {
        tour: null
      }
    });
  });
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('no document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('no Document found with this id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
exports.getAll = Model =>
  catchAsync(async (req, res) => {
    // EXECUTING QUERY
    let filter = {};
    if (req.params.tourId) filter = { tourRef: req.params.tourId };
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination(); // passing query obj n query string
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs
      }
    });
  });
