var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/test')
    .post(function (req, res) {
        var name = req.body.name;
        console.log(name);
        res.send('successful')
    });

module.exports = router;
