const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypageController');

router.get('/mypage', mypageController.getMyPage);

module.exports = router;
