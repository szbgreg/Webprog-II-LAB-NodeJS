var express = require('express');
var router = express.Router();
const { checkAdmin } = require('../modules/auth');

router.get('/', checkAdmin, function(req, res, next) {
  res.render('admin', { title: 'Admin oldal', user: req.user });
});

module.exports = router;
