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

app.get('/room1', (req, res) => {
    res.render('room1');
});

app.get('/room1_info', (req, res) => {
    const query = "SELECT id, photo1, photo2, monthly_money, fix_money, locate, rtype, floor, management_money FROM house WHERE rtype = '원룸'";
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('정보 가져오기 오류:', error);
            res.status(500).json({ error: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                const room1Info = results.map(result => ({
                    id: result.id,
                    photo1: result.photo1,
                    photo2: result.photo2,
                    fix_money: result.fix_money,
                    monthly_money: result.monthly_money,
                    management_money: result.management_money,
                    locate: result.locate,
                    rtype: result.rtype,
                    floor: result.floor
                }));
                res.json(room1Info);
            } else {
                res.status(404).json({ error: '사용자 정보를 찾을 수 없음' });
            }
        }
    });
});

app.get('/room2', (req, res) => {
    res.render('room2');
});

app.get('/room2_info', (req, res) => {
    const query = "SELECT id, photo1, photo2, monthly_money, fix_money, locate, rtype, floor, management_money FROM house WHERE rtype = '투ㆍ쓰리룸'";
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('정보 가져오기 오류:', error);
            res.status(500).json({ error: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                const room2Info = results.map(result => ({
                    id: result.id,
                    photo1: result.photo1,
                    photo2: result.photo2,
                    fix_money: result.fix_money,
                    monthly_money: result.monthly_money,
                    management_money: result.management_money,
                    locate: result.locate,
                    rtype: result.rtype,
                    floor: result.floor
                }));
                res.json(room2Info);
            } else {
                res.status(404).json({ error: '사용자 정보를 찾을 수 없음' });
            }
        }
    });
});

app.get('/officetel', (req, res) => {
    res.render('officetel');
});

app.get('/officetel_info', (req, res) => {
    const query = "SELECT id, photo1, photo2, monthly_money, fix_money, locate, rtype, floor, management_money FROM house WHERE rtype = '오피스텔'";
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('정보 가져오기 오류:', error);
            res.status(500).json({ error: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                const officetelInfo = results.map(result => ({
                    id: result.id,
                    photo1: result.photo1,
                    photo2: result.photo2,
                    fix_money: result.fix_money,
                    monthly_money: result.monthly_money,
                    management_money: result.management_money,
                    locate: result.locate,
                    rtype: result.rtype,
                    floor: result.floor
                }));
                res.json(officetelInfo);
            } else {
                res.status(404).json({ error: '사용자 정보를 찾을 수 없음' });
            }
        }
    });
});

app.get('/apartment', (req, res) => {
    res.render('apartment');
});

app.get('/apartment_info', (req, res) => {
    const query = "SELECT id, photo1, photo2, monthly_money, fix_money, locate, rtype, floor, management_money FROM house WHERE rtype = '아파트'";
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('정보 가져오기 오류:', error);
            res.status(500).json({ error: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                const apartmentInfo = results.map(result => ({
                    id: result.id,
                    photo1: result.photo1,
                    photo2: result.photo2,
                    fix_money: result.fix_money,
                    monthly_money: result.monthly_money,
                    management_money: result.management_money,
                    locate: result.locate,
                    rtype: result.rtype,
                    floor: result.floor
                }));
                res.json(apartmentInfo);
            } else {
                res.status(404).json({ error: '사용자 정보를 찾을 수 없음' });
            }
        }
    });
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
app.get('/roomdetail', (req, res) => {
    res.render('roomdetail', { naverMapAPIClientID: process.env.REACT_APP_API_CLIENT_ID });
});
app.get('/map', (req, res) => {
    res.render('map', { naverMapAPIClientID: process.env.REACT_APP_API_CLIENT_ID });
});

// 해당 마커의 데이터를 가져오는 엔드포인트
app.get('/get-room-data', (req, res) => {
    const roomId = req.query.id;
    
    // MySQL 쿼리를 사용하여 데이터를 가져옴
    const query = `SELECT * FROM house WHERE id = ${roomId}`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('방 정보 불러오기 실패 :', err);
        res.status(500).send('내부 서버 오류');
        return;
      }
      
      // 결과를 JSON 형식으로 반환
      res.json(results[0]); // 첫 번째 결과만 사용하도록 가정
    });
  });

app.get('/get-all-markers', (req, res) => {
    connection.query('SELECT id, latitude, longitude FROM house', (error, results, fields) => {
        if (error) {
            console.error('마커 정보 불러오기 실패 :', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            res.json(results);
        }
    });
});

app.get('/get-markers-by-roomtypes', (req, res) => {
    let selectedRoomTypes = req.query.roomTypes;

    if (Array.isArray(selectedRoomTypes)) {
        selectedRoomTypes = selectedRoomTypes.join(',');
    }

    if (typeof selectedRoomTypes !== 'string') {
        return res.status(400).json({ success: false, message: '방형태 선택이 필요함' });
    }

    selectedRoomTypes = selectedRoomTypes.split(',');

    let query = '';

    if (selectedRoomTypes.length > 0) {
        query = 'SELECT latitude, longitude FROM house WHERE ';
        selectedRoomTypes.forEach((roomType, index) => {
            query += `rtype = "${roomType}"`;
            if (index !== selectedRoomTypes.length - 1) {
                query += ' OR ';
            }
        });
    } else {
        query = 'SELECT latitude, longitude FROM house';
    }
    
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('마커 정보 가져오기 오류 :', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            res.json(results);
        }
    });
});

app.get('/get-markers-by-deposit', (req, res) => {
    const depositValue = req.query.deposit;

    const query = 'SELECT latitude, longitude FROM house WHERE fix_money <= ?';

    connection.query(query, [depositValue], (error, results, fields) => {
        if (error) {
            console.error('보증금 정보 가져오기 오류 :', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            res.json(results);
        }
    });
});

app.get('/get-markers-by-monthly', (req, res) => {
    const monthlyValue = req.query.monthly;

    const query = 'SELECT latitude, longitude FROM house WHERE monthly_money <= ?';

    connection.query(query, [monthlyValue], (error, results, fields) => {
        if (error) {
            console.error('월세 정보 가져오기 오류 :', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            res.json(results);
        }
    });
});

app.get('/get-markers-by-management', (req, res) => {
    const managementValue = req.query.management;

    const query = 'SELECT latitude, longitude FROM house WHERE management_money <= ?';

    connection.query(query, [managementValue], (error, results, fields) => {
        if (error) {
            console.error('관리비 정보 가져오기 오류 :', error);
            res.status(500).json({ success: false, message: '내부 서버 오류' });
        } else {
            res.json(results);
        }
    });
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

app.get('/ai_info', (req, res) => {
    const recentLocate = req.query.recentLocate; 

    const query = `
        SELECT id, photo1, monthly_money, fix_money, locate, rtype, floor, management_money 
        FROM house 
        WHERE locate = ?
    `;
  
    connection.query(query, [recentLocate], (error, results, fields) => {
        if (error) {
            console.error('정보 가져오기 오류:', error);
            res.status(500).json({ error: '내부 서버 오류' });
        } else {
            if (results.length > 0) {
                const aiInfo = results.map(result => ({
                    id: result.id,
                    photo1: result.photo1,
                    fix_money: result.fix_money,
                    monthly_money: result.monthly_money,
                    management_money: result.management_money,
                    locate: result.locate,
                    rtype: result.rtype,
                    floor: result.floor
                }));
                res.json(aiInfo);
            } else {
                res.status(404).json({ error: '정보를 찾을 수 없음' });
            }
        }
    });
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
