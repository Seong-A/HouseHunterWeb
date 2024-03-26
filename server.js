const express = require('express');
const path = require('path');

const app = express();

app.listen(5500, function(){
    console.log('listening on 5500');
})

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'main', 'main.html');
    res.sendFile(filePath);
});

app.use('/public', express.static('public'))