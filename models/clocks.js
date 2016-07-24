/**
 * Created by louis on 16/7/24.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var alarm_clock = new Schema({
    title: {type: String, required: true},
    bgm: {type: String, required: true},
    repeatDays: [],
    alertBody: String,
    hour: { type: Number, default: 0},
    minute: {type: Number, default: 0}, //
    isAlarm: Boolean,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});

mongoose.model('AlarmClock', alarm_clock);