const mongoose = require('mongoose');

const TimerSchema = new mongoose.Schema({
    endDateTime: { type: Date, required: true },
    theme: String,
    bgColor: String,
    fontColor: String,
    fontSize: Number,
    fontFamily: String,
    width: Number,
    height: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timer', TimerSchema);
