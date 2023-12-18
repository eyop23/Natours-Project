const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs');
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
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  this.password=await bcrypt.hash(this.password,10);
  this.passwordConfrim=undefined;
  next();
})
const User = mongoose.model('User', userSchema);
module.exports = User;
