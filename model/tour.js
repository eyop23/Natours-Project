const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field required'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'price field required']
  },
  rating: {
    type: Number,
    default: 4.7
  }
});
module.exports = mongoose.model('Tour', tourSchema);
