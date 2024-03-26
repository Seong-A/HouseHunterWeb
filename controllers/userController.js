const path = require('path');

exports.getLoginPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'user', 'login.html');
    res.sendFile(filePath);
};

exports.getJoinPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'user', 'join.html');
    res.sendFile(filePath);
};
