const express = require('express');
const router = express.Router();
const db = require("./db.js");  //引入数据库包
const { ObjectId } = require('mongodb')

router.get('/list', async function(req, res, next) {
    const course = db.collection('course')
    const rows = await course.aggregate([
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
            $unwind: "$tutor",
        },
    ]).toArray()
    res.json(rows)
});

router.post('/booking', async function(req, res, next) {
    const {
        student_user_id,
        course_id,
        course_name,
        tutor_user_id,
        date,
        time,
        username,
    } = req.body

    const courseBooking = db.collection('course_booking')
    await courseBooking.insertOne({
        student_user_id: new ObjectId(student_user_id),
        username,
        course_id: new ObjectId(course_id),
        course_name,
        tutor_user_id: new ObjectId(tutor_user_id),
        date,
        time,
        score: -1,
        state: ''
    })
    res.json({ code: 0, message: 'Booking success' })
});

router.post('/update', async function(req, res, next) {
    const {
        cover_img,
        name,
        description,
        course_id,
        tutor_user_id,
    } = req.body

    const course = db.collection('course')

    if(course_id) {
        // update course
        await course.updateOne(
            {"_id": new ObjectId(course_id)},
            {
                $set: {
                    name,
                    description,
                    cover_img,
                    tutor_user_id: new ObjectId(tutor_user_id),
                }
            }
        )
    }else{
        await course.insertOne({
            name,
            cover_img,
            description,
            tutor_user_id: new ObjectId(tutor_user_id)
        })
    }

    res.json({ code: 0, message: 'Update course success' })
});

router.post('/delete', async function(req, res, next) {
    const {
        id
    } = req.body

    const course = db.collection('course')
    await course.deleteMany({_id: new ObjectId(id)})
    res.json({ code: 0, message: 'Delete success' })
});

module.exports = router;
