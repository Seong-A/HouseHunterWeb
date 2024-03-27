const path = require('path');
const pool = require('../db/connect').getPool();

exports.getHeaderPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'header', 'header.html');
    res.sendFile(filePath);
};

exports.checkLogin = (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    if (isLoggedIn) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
};
