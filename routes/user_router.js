/**
 * Created by louis on 16/7/8.
 */
var db = require('../models/db'),
    user = require('../models/users'),
    mongoose = require('mongoose'),
    express = require('express'),
    merge = require('../lib/object-merge');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
        mongoose.model('User').find({}, function (err, users) {
            if (err) {
                return console.log(err);
            } else {
                res.json(users); // users is a list
            }
        });
    })
    // POST a new user
    .post(function (req, res) {
        // console.log(JSON.stringify(req.body));
        var name = req.body.name;
        var password = req.body.password;
        var gender = req.body.gender;
        mongoose.model('User').find({'name':name}, function (err, users) {
            if (err) {
                res.json({'code': 500, 'msg': 'There is a problem to the database!'})
            } else {
                // console.log(JSON.stringify(users));
                // console.log(typeof users);
                if (users.length == 0) {
                    // users is []
                    mongoose.model('User').create({
                        name: name,
                        password: password,
                        gender: gender,
                        create_date: new Date(),
                        update_date: new Date()
                    }, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': 'Create failure'})
                        } else {
                            var msg = merge({'code':200, 'msg': 'Create successful'}, JSON.parse(JSON.stringify(result)));
                            res.json(msg);
                        }
                    });
                } else {
                    // users is a object
                    mongoose.model('User').update({
                        name: name,
                        password: password,
                        gender: gender,
                        update_date: new Date()
                    }, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': 'Update failure'})
                        } else {
                            var msg = merge({'code':200, 'msg': 'Update successful'}, JSON.parse(JSON.stringify(result)));
                            res.json(msg);
                        }
                    });
                }
            }
        });
    });


module.exports = router;
