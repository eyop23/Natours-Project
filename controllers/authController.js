const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRYDATE
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfrim: req.body.passwordConfrim
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    result: {
      data: newUser
    }
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please provide email n passaword', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    result: {
      data: user
    }
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('not authorized', 401));
  }
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY);
  console.log(decoded);
  // Get user from the token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('no user exist with this token', 401));
  }
  console.log(currentUser);
  next();
});
