const express = require('express');
const router = express.Router();
const db = require("./db.js");  //引入数据库包
const { ObjectId } = require('mongodb')

// will display in the profile page
router.get('/list', async function(req, res, next) {
    const courseBooking = db.collection('course_booking')

    let params = {}
    if(req.query.user_type === 'student'){
        params = {
            student_user_id: new ObjectId(req.query.user_id)
        }
    } else if(req.query.user_type === 'tutor'){
        params = {
            tutor_user_id: new ObjectId(req.query.user_id)
        }
    }

    let rows = await courseBooking.aggregate([
        {
            $lookup:
                {
                    from: "user",
                    localField: "student_user_id",
                    foreignField: "_id",
                    as: "student",
                },
        },
        {
            $lookup:
                {
                    from: "user",
                    localField: "tutor_user_id",
                    foreignField: "_id",
                    as: "tutor",
                },
        },
        {
            $match: params,
        },
    ]).toArray()
    res.json(rows)
});

router.post('/rate', async function(req, res, next) {
    const {
        booking_id,
        score
    } = req.body
    const courseBooking = db.collection('course_booking')
    await courseBooking.updateOne({"_id": new ObjectId(booking_id)},
        {
            $set: {
                score: score
            }
        })
    res.json({ code: 0, message: 'Rating success' })
});

router.post('/updateState', async function(req, res, next) {
    const {
        id,
        state
    } = req.body
    const courseBooking = db.collection('course_booking')
    await courseBooking.updateOne({"_id": new ObjectId(id)},
        {
            $set: {
                state: state
            }
        })
    res.json({ code: 0, message: state +' success' })
});

module.exports = router;
