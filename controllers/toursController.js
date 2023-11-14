const Tour = require('../model/tourModel.js');
// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
// exports.CheakID = (req, res, next, val) => {
//   const tour = tours.find(tours => tours.id === +req.params.id);
//   console.log(`param middleware ${val}`);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'not found',
//       message: 'invalid id'
//     });
//   }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.GetAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // EACH MONGODB QUERY RETURN ANOTHER QUERY UNTIL IT AWAIT IT TO GET THE DOCUMENT
    // 1.EXCLUDING QUERY
    const ExcludeQuery = ['page', 'limit', 'sort', 'fields'];
    ExcludeQuery.forEach(el => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace('lte', '$lte'); //returns a string
    let query = Tour.find(JSON.parse(queryString));
    //2.SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('createdAt');
    }
    //3.field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //4.PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error('This page does not exist');
    }
    // EXECUTING QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
  // res.status(200).json({
  //   status: 'ok',
  //   time: req.requetedTime,
  //   data: {
  //     tours
  //   }
  // });
};
exports.GetTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
  // if(!id) return;
  // const tour = tours.find(tours => tours.id === +req.params.id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};
exports.UpdateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
  // const tour = tours.find(tours => tours.id === +req.params.id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: 'updated tour'
  //   }
  // });
};
exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      Message: error
    });
  }
  // const tour = tours.find(tours => tours.id === +req.params.id);
  // res.status(204).json({
  //   status: 'success',
  //   data: {
  //     tour: null
  //   }
  // });
};
exports.PostTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save().then.catch()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(404).json({
      error
    });
  }
};
