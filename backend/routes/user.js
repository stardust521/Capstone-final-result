const express = require('express');
const router = express.Router();
const db = require("./db.js");  //引入数据库包
const { ObjectId } = require('mongodb')
const crypto = require('crypto')
const salt = 'random_string'

const md5 = str => {
    return crypto.createHash('md5').update(salt + str).digest('hex')
}

router.post('/register/', async function(req, res, next) {
    const {
        accountType,
        username,
        password,
        nickname,
        faculty,
        like,
        bio
    } = req.body

    const user = db.collection('user')
    const existsNum = await user.count({ username: username})
    if(existsNum === 0){
        user.insertOne({
            type: accountType,
            username,
            password: md5(password),
            nickname,
            faculty,
            bio,
            like,
            avatar: '4.png'
        })
        res.json({ code: 0, message: 'Register success' })
    }else{
        res.json({ code: 500, message: 'Username has exists' })
    }
});

router.post('/reset/password', async function(req, res, next) {
    const {
        password,
        userId
    } = req.body

    const user = db.collection('user')
    await user.updateOne({_id: new ObjectId(userId)}, {
        $set: {password: md5(password)}
    })

    res.json({ code: 0, message: 'Reset password success' })
});


router.get('/queryUsernameByGoogleId', async function(req, res, next) {
    const user = db.collection('user')
    const userList = await user.find({google_id: req.query.google_id}).toArray()
    if(userList.length === 0){
        res.json({ code: 500, message: 'Associated account first' })
    }else{
        res.json({ code: 0, message: 'Google login success', user: userList[0] })
    }
});

router.get('/login', async function(req, res, next) {
    const user = db.collection('user')
    const userList = await user.find({username: req.query.username, password: md5(req.query.password)}).toArray()
    if(userList.length === 0){
        res.json({ code: 500, message: 'Username or password is not correct' })
    }else{
        res.json({ code: 0, message: 'login success', user: userList[0] })
    }
});

router.post('/update', async function(req, res, next) {
    const {
        userId,
        accountType,
        nickname,
        faculty,
        like,
        bio,
        avatar
    } = req.body

    const user = db.collection('user')
    await user.updateOne({_id: new ObjectId(userId)}, {
        $set: {nickname, faculty, bio,like,avatar}
    })

    const users = await user.find({_id: new ObjectId(userId)}).toArray()
    res.json({ code: 0, message: 'save success', user: users[0] })
});

router.post('/google/associate', async function(req, res, next) {
    const {
        googleId,
        username,
    } = req.body

    const user = db.collection('user')
    await user.updateOne({username}, {
        $set: {
            google_id: googleId
        }
    })
    const loginUser = await user.find({username}).toArray()[0]
    res.json({ code: 0, message: 'save success', user: loginUser })
});

router.post('/delete', async function(req, res, next) {
    const {
       id
    } = req.body

    const user = db.collection('user')
    await user.deleteMany({_id: new ObjectId(id)})
    res.json({ code: 0, message: 'Delete success' })
});

// search tutor menu
router.get('/tutor/list', async function(req, res, next) {
    const user = db.collection('user')
    const rows = await user.aggregate([
        {
            $lookup: {
                from: "course_booking",
                localField: "_id",
                foreignField: "tutor_user_id",
                as: "course_booking",
            },
        },
        {
            $match:
                {
                    type: "tutor",
                },
        },
    ]).toArray()
    res.json(rows)
});

router.get('/list', async function(req, res, next) {
    const user = db.collection('user')
    const rows = await user.find().toArray()
    res.json(rows)
});


module.exports = router;
