const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.get('/', authController.protect, reviewController.getAllReview);
// router.post('/', authController.protect, reviewController.createReview);
router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictedTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .get(reviewController.getReview)
  .patch(reviewController.updateReview);

module.exports = router;
