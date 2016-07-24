/**
 * Created by louis on 16/7/24.
 */
var db = require('../models/db'),
    user = require('../models/users'),
    clock = require('../models/clocks'),
    mongoose = require('mongoose'),
    express = require('express');
var router = express.Router();


router.post('/all', function (req, res) {
    mongoose.model('AlarmClock').find({'userID':req.body.userID }, function (err, clocks) {
        if (err) {
            res.json({'code': 500, 'msg': 'Get Error'})
        } else {
            var msg = {'code': 200, 'msg': 'Get successful', 'content': clocks};
            res.json(msg);
        }
    });
});

router.post('/new', function (req, res) {
    var body = req.body;
    console.log(JSON.stringify(req.body));
    mongoose.model('AlarmClock').create(body, function (err, result) {
        if (err) {
            res.json({'code': 500, 'msg': 'Create failure'})
        } else {
            var msg = {'code':200, 'msg': 'Create successful', 'content' : result};
            res.json(msg);
        }
    });
});


router.param('id', function (req, res, next, id) {
    mongoose.model('AlarmClock').findById(id, function (err, user) {
        if (err || !user) {
            res.json({'code': 404, 'msg': 'Not Found'});
        } else {
            req.id = id;
            next();
        }
    });
});

router.post('/:id/update', function (req, res) {
    var body = req.body;
    console.log(JSON.stringify(req.body));
    mongoose.model('AlarmClock').findByIdAndUpdate(req.id, {$set:body}, function (err, result) {
        if (err) {
            res.json({'code': 500, 'msg': 'Get Error'})
        } else {
            // user is a object
            var msg = {'code':200 , "content": result};
            res.json(msg);
        }
    });
});

router.get('/:id/delete', function(req, res) {
    mongoose.model('AlarmClock').findById(req.id, function (err, user) {
        if (err) {
            res.json({'code': 500, 'msg': 'Get Error'})
        } else {
            user.remove(function (err, result) {
                if (err) {
                    res.json({'code': 500, 'msg': 'Delete Error'})
                } else {
                    var msg = {'code': 200, 'content': result};
                    res.json(msg);
                }
            });
        }
    });
});

module.exports = router;