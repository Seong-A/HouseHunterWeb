require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlModule = require('./db/connect');
const path = require('path');

const app = express();
const port = 5500;

const connection = mysqlModule.getPool();
app.use(bodyParser.json());


const naverMapAPIClientID = process.env.REACT_APP_API_CLIENT_ID;

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
}));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/header', (req, res) => {
    res.render('header');
});

app.get('/mypage', (req, res) => {
    if (req.session.isLoggedIn) {
        res.render('mypage');
    } else {
        res.redirect('/login');
    }
});


app.get('/loaduser', (req, res) => {
    if (req.session.isLoggedIn) {
        const userId = req.session.userId; 
        const query = 'SELECT name FROM user WHERE id = ?';

        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                console.error('사용자 정보 가져오기 오류:', error);
                res.status(500).json({ success: false, message: '내부 서버 오류' });
            } else {
                if (results.length > 0) {
                    const userName = results[0].name;
                    res.json({ userName }); 
                } else {
                    res.status(404).json({ message: '사용자 정보를 찾을 수 없음' });
                }
            }
        });
    } else {
        res.status(401).json({ message: '로그인되지 않은 사용자' });
    }
});

app.get('/map', (req, res) => {
    res.render('map', { naverMapAPIClientID: process.env.REACT_APP_API_CLIENT_ID });
});

app.get('/contents', (req, res) => {
    res.render('contents');
});

app.get('/roomdetail', (req, res) => {
    res.render('roomdetail');
});

app.get('/help', (req, res) => {
    res.render('help');
});

app.get('/join', (req, res) => {
    res.render('join');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/userinfo', (req, res) => {
    res.render('userinfo');
});

app.get('/check-login', (req, res) => {
    if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const query = 'SELECT name FROM user WHERE id = ?';

        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                console.error('사용자 정보 가져오기 오류:', error);
                res.status(500).json({ isLoggedIn: false });
            } else {
                if (results.length > 0) {
                    const userName = results[0].name;
                    res.json({ isLoggedIn: true, userName: userName });
                } else {
                    res.json({ isLoggedIn: false });
                }
            }
        });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.post('/register', (req, res) => {
    const userData = req.body;

    const query = 'INSERT INTO user (id, password, name, phone) VALUES (?, ?, ?, ?)';
    const values = [userData.id, userData.password, userData.name, userData.phone];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('사용자 등록 오류:', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            console.log('사용자 등록 성공');
            res.status(200).json({ success: true, message: '사용자 등록 성공' });
        }
    });
});

app.get('/current_user_info', (req, res) => {
    if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const query = 'SELECT id, name, phone FROM user WHERE id = ?';

        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                console.error('사용자 정보 가져오기 오류:', error);
                res.status(500).json({ error: '내부 서버 오류' });
            } else {
                if (results.length > 0) {
                    const userInfo = {
                        id: results[0].id,
                        name: results[0].name,
                        phone: results[0].phone
                    };
                    res.json(userInfo);
                } else {
                    res.status(404).json({ error: '사용자 정보를 찾을 수 없음' });
                }
            }
        });
    } else {
        res.status(401).json({ error: '로그인되지 않은 사용자' });
    }
});

app.post('/update', (req, res) => {
    const userData = req.body;

    const query = 'UPDATE user SET password = ?, name = ?, phone = ? WHERE id = ?';
    const values = [userData.password, userData.name, userData.phone, userData.id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('회원정보 수정 오류:', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            console.log('회원정보 수정 성공');
            res.status(200).json({ success: true, message: '회원정보 수정 성공' });
        }
    });
});

app.post('/login', (req, res) => {
    const userData = req.body;

    const query = 'SELECT * FROM user WHERE id = ? AND password = ?';
    const values = [userData.id, userData.password];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('로그인 오류:', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                req.session.isLoggedIn = true;
                req.session.userId = results[0].id;
                console.log('로그인 성공');
                res.status(200).json({ success: true, message: '로그인 성공' });
            } else {
                console.log('로그인 실패');
                res.status(401).json({ success: false, message: '로그인 실패' });
            }
        }
    });
});

app.post('/set-session', (req, res) => {
    const { isLoggedIn, userId } = req.body;
    req.session.isLoggedIn = isLoggedIn;
    req.session.userId = userId;
    res.json({ success: true });
});

app.post('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/'); 
});

module.exports = app;
