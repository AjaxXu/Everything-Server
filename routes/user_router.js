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
        var head_image = req.body.head_image;
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
                        head_image: head_image,
                        create_date: new Date(),
                        update_date: new Date()
                    }, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': 'Create failure'})
                        } else {
                            var msg = {'code':200, 'msg': 'Create successful', 'content' : result};
                            res.json(msg);
                        }
                    });
                } else {
                    // users is a object
                    mongoose.model('User').update({
                        name: name,
                        password: password,
                        gender: gender,
                        head_image: head_image,
                        update_date: new Date()
                    }, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': 'Update failure'});
                        } else {
                            var msg = {'code':200, 'msg': 'Update successful', 'content': result };
                            res.json(msg);
                        }
                    });
                }
            }
        });
    });

router.param('id', function (req, res, next, id) {
    mongoose.model('User').findById(id, function (err, user) {
        if (err || !user) {
            res.json({'code': 404, 'msg': 'Not Found'});
            // res.status(404);
            // var err = new Error('Not Found');
            // err.status = 404;
            // res.format({
            //     html: function () {
            //         next(err);
            //     },
            //     json: function () {
            //         res.json({message : err.status + ' ' + err});
            //     }
            // });
        } else {
            req.id = id;
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('User').findById(req.id, function (err, user) {
            if (err) {
                res.json({'code': 500, 'msg': 'Get Error'})
            } else {
                var msg = {'code': 200, 'msg': 'Get successful', 'content': user};
                res.json(msg);
            }
        });
    })
    .post(function (req, res) {
        var name = req.body.name;
        var password = req.body.password;
        var gender = req.body.gender;
        // mongoose.model('User').findById(req.id, function (err, user) {
        //     user.update({
        //         name: name,
        //         password: password,
        //         gender: gender,
        //         update_date: new Date()
        //     }, function (err, result) {
        //         result is the number of update user
        //         if (err) {
        //             res.json({'code': 500, 'msg': 'Get Error'})
        //         } else {
        //             var msg = merge({'code':200, 'msg': 'Update successful'}, JSON.parse(JSON.stringify(result)));
        //             res.json(msg);
        //         }
        //     });
        // });
        mongoose.model('User').findByIdAndUpdate(req.id, {$set:{
            name: name,
            password: password,
            gender: gender,
            update_date: new Date()
        }}, function (err, user) {
            if (err) {
                res.json({'code': 500, 'msg': 'Get Error'})
            } else {
                // user is a object
                var msg = {'code':200 , "content": user};
                res.json(msg);
            }
        });
    });
router.route('/:id/delete')
    .get(function(req, res) {
        mongoose.model('User').findById(req.id, function (err, user) {
            if (err) {
                res.json({'code': 500, 'msg': 'Get Error'})
            } else {
                user.remove(function (err, result) {
                    if (err) {
                        res.json({'code': 500, 'msg': 'Delete Error'})
                    } else {
                        var msg = {'code':200 , 'content': result};
                        res.json(msg);
                    }
                });
            }
        });
    });


module.exports = router;
