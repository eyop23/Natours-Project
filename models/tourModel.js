const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      minlength: [4, 'minimum tour name should be greater than 4'],
      maxlength: [40, 'maximun tour name should be 40']
    },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy,medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this referes to the current document n only works when creating new doc(CREATE N SAVE)
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image']
    },
    images: [String],
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secrteTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        defalut: 'Point',
        enum: ['Point']
      },
      coordinate: [Number],
      address: String,
      description: String
    },
    location: [
      {
        type: {
          type: String,
          defalut: 'Point',
          enum: ['Point']
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationInWeek').get(function() {
  return this.duration / 7;
});
//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tourRef',
  localField: '_id'
});
//document middleware only for create() n save()
tourSchema.pre('save', function(next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', async function(next) {
//   const guidePromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });
tourSchema.post('save', function(docs, next) {
  // console.log(docs);
  next();
});
// query middleware
tourSchema.pre(/^find/, function(next) {
  this.find({ secrteTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});
//Aggregattion MiddleWare
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secrteTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});
module.exports = mongoose.model('Tour', tourSchema);
