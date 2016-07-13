/**
 * Created by louis on 16/7/8.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

var user = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    phone_number: String,
    nickname: String,
    gender: { type: Number, default: 0}, //0 for unknown, 1 for male, 2 for female
    head_image: {type:String, default: 'images/1.png'}, // head image
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
    address: String,
    autograph: String
});

user.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userid',
    startAt: 10,
    incrementBy: 1
});

mongoose.model('User', user);
