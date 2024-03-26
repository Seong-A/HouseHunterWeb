const path = require('path');
const pool = require('../db/connect').getPool();

exports.getLoginPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'user', 'login.html');
    res.sendFile(filePath);
};

exports.loginUser = (req, res) => {
    const userData = req.body;

    const query = 'SELECT * FROM user WHERE id = ? AND password = ?';
    const values = [userData.id, userData.password];
    pool.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('로그인 오류:', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                console.log('로그인 성공');
                res.status(200).json({ success: true, message: '로그인 성공' });
            } else {
                console.log('로그인 실패');
                res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
            }
        }
    });
};

exports.getJoinPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'user', 'join.html');
    res.sendFile(filePath);
};

exports.checkLogin = (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const userId = req.session.userId;

    res.json({ isLoggedIn, userId });
};

exports.registerUser = (req, res) => {
    const userData = req.body;

    const query = 'INSERT INTO user (id, password, name, phone) VALUES (?, ?, ?, ?)';
    const values = [userData.id, userData.password, userData.name, userData.phone];

    pool.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('사용자 등록 오류:', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            console.log('사용자 등록 성공');
            res.status(200).json({ success: true, message: '사용자 등록 성공' });
        }
    });
};