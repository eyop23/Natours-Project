const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.get('/', authController.protect, reviewController.getAllReview);
// router.post('/', authController.protect, reviewController.createReview);
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictedTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictedTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictedTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
