const mongoose = require('mongoose');
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
    tourRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review belogs to a tour ']
    },
    userRef: {
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
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;