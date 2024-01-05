const mongoose = require('mongoose');
const tourModel = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review belogs to a tour ']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review belogs to a user ']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tourRef',
  //   select: 'name '
  // }).populate({
  //   path: 'userRef',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
reviewSchema.statics.calcualteAvaerageRatings = async function(tourId) {
  // this points to the method in statics
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avaRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avaRating
    });
  } else {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};
reviewSchema.post('save', function() {
  //this points to current review
  this.constructor.calcualteAvaerageRatings(this.tour);
});
//to get the cuurent document  when we update n delete the review in ordre to calculate the rating in tour
//findByIdAndUpdate and findByIdAndDelete can't access documentmideleware
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcualteAvaerageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
