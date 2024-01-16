const viewsController = require('../controllers/viewsController');
const express = require('express');
const router = express.Router();
router.get('/', viewsController.getTourOverView);
router.get('/tour', viewsController.getTour);
module.exports = router;
