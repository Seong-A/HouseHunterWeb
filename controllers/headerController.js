const path = require('path');

exports.getHeaderPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'header', 'header.html');
    res.sendFile(filePath);
};
