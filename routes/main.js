const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');

// Define routes for handling user authentication
router.get('/', mainController.main);

module.exports = router;