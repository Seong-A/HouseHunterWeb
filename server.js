const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const headerRoutes = require('./routes/headerRoutes');

const app = express();
const port = 5500;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/header', headerRoutes);

module.exports = app;
