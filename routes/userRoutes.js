const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLoginPage);
router.get('/join', userController.getJoinPage);

module.exports = router;
