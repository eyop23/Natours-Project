const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
    minlength: 8,
    select: false
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
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfrim = undefined;
  next();
});
// INSTANCE METHOD WHICH IS AVAILABLE IN ALL DOC IN CERTAIN COLLECTION
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
