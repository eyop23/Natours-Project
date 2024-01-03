const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handler');
const filterdObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfrim) {
    return next(
      new AppError(
        'use this route: /updateMyPassword  to update your password',
        400
      )
    );
  }

  const filterdBody = filterdObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true
  });
  if (!updatedUser) {
    return next(
      new AppError('no user found with this id,please login again', 404)
    );
  }

  res.status(500).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  if (!user) {
    return next(new AppError('no user found with this ID', 404));
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      user: null
    }
  });
});
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
