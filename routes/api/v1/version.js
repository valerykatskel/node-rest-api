const express = require('express');
const router = express.Router();
const versionController = require('../../../controllers/version');

// Define routes for handling user authentication
router.get('/version', versionController.version);

module.exports = router;