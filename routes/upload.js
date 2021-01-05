var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/upload', function(req, res, next) {
  const form = formidable({ multiples: true });
  
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join("public/upload/", file.name),function (err) {
      if (err) throw err;
    });
  }); 
  
  form.on('error', function(err) {
    console.log('A file upload error has occured: \n' + err);
  }); 
  form.on('end', function() {
    setTimeout((function() {res.json(tree(form.uploadDir, {exclude: excludePaths}))}), 800);
  }); 
  
  // parse the incoming request containing the form data
  form.parse(req);
});

module.exports = router;