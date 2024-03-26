const express = require('express');
const router = express.Router();
const headerController = require('../controllers/headerController');

router.get('/', headerController.getHeaderPage);

module.exports = router;