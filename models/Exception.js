const mongoose = require('mongoose');
const {Timestamp} = require("mongodb");

const ExceptionLogSchema = new mongoose.Schema({
    deviceId: {type: String, required: true},
    exceptionMessage: {type: String, required: true},
    timestamp: {type: String, required: true}
})

const ExceptionLog = mongoose.model("ExceptionLogs", ExceptionLogSchema);

module.exports = {ExceptionLog}
