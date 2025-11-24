var express = require('express');
var router = express.Router();
const { checkAuth } = require('../modules/auth');

router.get('/', checkAuth, function(req, res, next) {
  res.send('Ez a tartalom csak bejelentkezett felhasználóknak érhető el.');
});

module.exports = router;
