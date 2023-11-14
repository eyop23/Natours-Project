const express = require('express');
const router = express.Router();
const {
  GetTour,
  GetAllTours,
  UpdateTour,
  PostTour,
  DeleteTour,
  aliasTopTours
} = require('../controllers/toursController');
// router.param('id', CheakID);
router.route('/top-5-cheap').get(aliasTopTours, GetAllTours);
router.route('/').get(GetAllTours).post(PostTour);
router.route('/:id').get(GetTour).patch(UpdateTour).delete(DeleteTour);
module.exports = router;
