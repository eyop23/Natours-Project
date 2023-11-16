const express = require('express');
const router = express.Router();
const {
  GetTour,
  GetAllTours,
  UpdateTour,
  PostTour,
  DeleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/toursController');
// router.param('id', CheakID);
router.route('/top-5-cheap').get(aliasTopTours, GetAllTours);
router.route('/tour-stat').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(GetAllTours).post(PostTour);
router.route('/:id').get(GetTour).patch(UpdateTour).delete(DeleteTour);
module.exports = router;
