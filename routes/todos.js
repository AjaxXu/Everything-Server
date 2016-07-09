/**
 * Created by louis on 16/7/8.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({"todos":"test"});
});

router.get('/test', function (req, res, next) {
    res.jsonp("{'test':'test string'}");
});

module.exports = router;