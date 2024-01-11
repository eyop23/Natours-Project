const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./review');
const router = express.Router();
const {
  GetTour,
  GetAllTours,
  UpdateTour,
  PostTour,
  DeleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin
} = require('./../controllers/toursController');
// router.param('id', CheakID);
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, GetAllTours);
router.route('/tour-stat').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictedTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
router
  .route('/')
  .get(GetAllTours)
  .post(
    authController.protect,
    authController.restrictedTo('admin', 'lead-guide'),
    PostTour
  );
router
  .route('/:id')
  .get(GetTour)
  .patch(
    authController.protect,
    authController.restrictedTo('admin', 'lead-guide'),
    UpdateTour
  )
  .delete(
    authController.protect,
    authController.restrictedTo('admin', 'lead-guide'),
    DeleteTour
  );
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictedTo('user'),
//     reviewController.createReview
//   );
module.exports = router;
