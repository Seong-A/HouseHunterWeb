const path = require('path');

exports.getMainPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'main', 'main.html');
    res.sendFile(filePath);
};
