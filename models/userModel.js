const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a user name is required ']
  },
  email: {
    type: String,
    required: [true, 'a user  email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please add a password'],
    minlength: 8
  },
  passwordConfrim: {
    type: String,
    required: [true, 'please confrim your password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'password are not matched'
    }
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;
