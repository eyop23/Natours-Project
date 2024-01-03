const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handler');
// const AppError = require('./../utils/appError');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tourRef) req.body.tourRef = req.params.tourId;
  if (!req.body.userRef) req.body.userRef = req.user.id;
  next();
};
exports.getAllReview = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
