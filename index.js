const express = require('express');
const configs = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./configs/Config');
const mongoose = require('mongoose');
const apiUrls = require("./constants/ApiUrls")
const {ExceptionLog} = require("./models/Exception");
const {body, validationResult} = require("express-validator");


const app = express();

mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then((res) => {
    app.listen(config.PORT, '0.0.0.0', () => {
        console.log("connected to the ", config.PORT)
    });
}).catch(error => console.log(error));

app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.json());
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.get(apiUrls.HOME, async (req, res) => {
    var x = {"status": "SUCCESS"}
    res.json(x);

})


app.post(apiUrls.CREATE_EXCEPTION, [body("deviceId", "Device Id is required").isLength({min: 1}).trim().escape(), body("exceptionMessage", "Exception Message is required").isLength({min: 1}).trim().escape(), body("timestamp", "Timestamp is required").isLength({min: 1}).trim().escape()], async (req, res) => {
    const errors = validationResult(req).array();
    if (errors && errors.length) {
        console.log(errors);
        res.status(400).json({errors});
    }

    const exception = await ExceptionLog.create({
        deviceId: req.body.deviceId,
        exceptionMessage: req.body.exceptionMessage,
        timestamp: req.body.timestamp
    });

    res.json(exception);

})

app.get(apiUrls.FETCH_EXCEPTIONS, async (req, res) => {
    const exceptions = await ExceptionLog.find();
    res.json(exceptions);
})