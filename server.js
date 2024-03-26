const express = require('express');
const app = express();
const path = require('path');

app.listen(5500, function(){
    console.log('listening on 5500');
})

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.get('/main', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'html', 'main.html');
    res.sendFile(filePath);
});

app.use('/public', express.static('public'))