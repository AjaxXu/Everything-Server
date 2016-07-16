/**
 * Created by louis on 16/7/8.
 */
var db = require('../models/db'),
    user = require('../models/users'),
    mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require('body-parser'),
    formidable = require('formidable'),
    fs = require('fs'),
    AVATAR_UPLOAD_FOLDER = '/images/avatar/';
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
                console.log(JSON.stringify(users));
                // console.log(typeof users);
                if (users.length == 0) {
                    // users is []
                    mongoose.model('User').create({
                        username: name,
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
                        username: name,
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

router.route('/register')
    .post(function (req, res) {
        // console.log(JSON.stringify(req.body));
        var phone_number = req.body.phone_number;
        var password = req.body.password;
        mongoose.model('User').find({'phone_number':phone_number}, function (err, users) {
            if (err) {
                res.json({'code': 500, 'msg': '系统错误'})
            } else {
                if (users.length == 0) {
                    // users is []
                    mongoose.model('User').create({
                        phone_number: phone_number,
                        username : phone_number,
                        password: password,
                        create_date: new Date(),
                        update_date: new Date()
                    }, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': '注册失败'})
                        } else {
                            var msg = {'code':200, 'msg': '注册成功', 'content' : result};
                            res.json(msg);
                        }
                    });
                } else {
                    // users is a object
                    res.json({'code': 500, 'msg': '手机号已经被注册!\n请直接登录'})
                }
            }
        });
    });

router.route('/login')
    .post(function (req, res) {
        var phone_number = req.body.phone_number;
        var password = req.body.password;
        mongoose.model('User').find({'phone_number':phone_number}, function (err, users) {
            if (err) {
                res.json({'code': 500, 'msg': '系统错误'})
            } else {
                if (users.length == 0) {
                    res.json({'code': 500, 'msg': '该手机号还未注册!请先注册'})
                } else {
                    // users is a object
                    user = users[0];
                    console.log(JSON.stringify(user));
                    if (password == user.password) {
                        res.json({'code':200, 'msg': '登录成功', 'content': user });
                    } else {
                        res.json({'code': 500, 'msg': '登录失败'});
                    }
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
        var body = req.body;
        // console.log(req.body);
        body.update_date = new Date();
        mongoose.model('User').findByIdAndUpdate(req.id, {$set:body}, function (err, user) {
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

router.post('/:id/head_image', bodyParser.urlencoded({ extended: false }),function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        if (err) {
            res.locals.error = err;
            res.json({'code': 500, 'msg': 'Update image Error'});
        }
        else{
            var newPath = form.uploadDir + files.head_image.name;
            fs.renameSync(files.head_image.path, newPath);  //重命名

            fields.head_image = AVATAR_UPLOAD_FOLDER + files.head_image.name;
            fields.update_date = new Date();

            mongoose.model('User').findById(req.id, function (err, user) {
                if (err) {
                    res.json({'code': 500, 'msg': 'There is a problem to the database!'})
                } else {
                    // users is a object
                    user.update(fields, function (err, result) {
                        if (err) {
                            res.json({'code': 500, 'msg': 'Update failure'});
                        } else {
                            user.head_image = fields.head_image;
                            user.update_date = fields.update_date;
                            var msg = {'code':200, 'msg': 'Update successful', 'content': user };
                            res.json(msg);
                        }
                    });
                }
            });
        }

    });
});


module.exports = router;
