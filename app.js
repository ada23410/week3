const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 資料庫設定開始
const mongoose = require('mongoose');
const dotenv= require('dotenv');

dotenv.config({path:"./config.env"});

const DB = process.env.DATABASE.replace(
    '<password>',
    encodeURIComponent(process.env.DATABASE_PASSWORD)
)

mongoose.connect(DB)
    .then(res=> console.log("連線資料成功"))
    .catch((error)=> {console.log('資料連線失敗',error)});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 貼文路徑
const postsRouter = require('./routes/posts');
var app = express();

app.use(cors());
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
    res.status(404).json({
        status: 'false',
        message: '無此網站路由'
    });
});

// const port = process.env.PORT || 3000; 
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

module.exports = app;
