const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require("cors")
const logger = require('morgan');

const fileUpload = require('express-fileupload')

const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const courseBookingRouter = require('./routes/course_booking');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'ejs');

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/booking", courseBookingRouter);

app.post('/upload', (req, resp) => {
    const img = req.files.cover_img
    if(img) {
        img.mv('./public/' + img.name)
        resp.send({
            data: 'upload success'
        })
    }else{
        resp.send({
            message: 'No file uploaded'
        })
    }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    console.log(err.message)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
