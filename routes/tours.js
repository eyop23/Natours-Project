const express = require('express');
const router = express.Router();
const {
  GetTour,
  GetAllTours,
  UpdateTour,
  PostTour,
  DeleteTour
} = require('../controllers/toursController');
// router.param('id', CheakID);
router.route('/').get(GetAllTours).post(PostTour);
router.route('/:id').get(GetTour).patch(UpdateTour).delete(DeleteTour);
module.exports = router;
