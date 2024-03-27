const express = require('express');
const router = express.Router();
const headerController = require('../controllers/headerController');

router.get('/', headerController.getHeaderPage);
router.get('/check-login', headerController.checkLogin);

module.exports = router;