const viewsController = require('../controllers/viewsController');
const express = require('express');
const router = express.Router();
router.get('/', viewsController.getTourOverView);
router.get('/tours/:name', viewsController.getTour);
module.exports = router;
