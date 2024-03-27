const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLoginPage);
router.get('/join', userController.getJoinPage);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
