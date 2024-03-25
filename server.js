const express = require('express');
const app = express();

app.listen(5500, function(){
    console.log('listening on 5500');
})

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.use('/public', express.static('public'))