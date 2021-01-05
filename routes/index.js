var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async  function(req, res, next) {
  let  data = {
    message: 'Hello world!',
    layout:  'layout.njk',
    title: 'Nunjucks example'
  }

  res.render('index.njk', data)
})

module.exports = router;
