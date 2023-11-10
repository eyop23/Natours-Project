const Tour = require('../model/tour.js');
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

exports.GetAllTours = async (req, res) => {
  // console.log(req.requetedTime);
  try {
    const tours = await Tour.find();
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
