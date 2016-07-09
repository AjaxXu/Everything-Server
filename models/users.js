/**
 * Created by louis on 16/7/8.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

var user = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    gender: { type: Number, default: 0}, //0 for unknown, 1 for male, 2 for female
    head_image: String, // head image
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now }
});

user.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userid',
    startAt: 10,
    incrementBy: 1
});

mongoose.model('User', user);
