const path = require('path');

exports.getMyPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mypage', 'mypage.html');
    res.sendFile(filePath);
};

exports.getContentsPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mypage', 'contents.html');
    res.sendFile(filePath);
};