var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index.ejs');
});
router.get('/Help', function(req, res, next) {
  res.render("Help.ejs");
});
module.exports = router;
