var express = require('express');
var router = express.Router();
var passport = require('passport');
require('./config/passport')(passport);
/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false}),function(req, res, next) {
  res.render('index', { title: 'Galaxy Book Store' });
});

module.exports = router;