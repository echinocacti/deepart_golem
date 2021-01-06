const express = require('express');
const router = express.Router();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

router.post('/upload', function(req, res, next) {
  
  let fun = () => {const form = new formidable.IncomingForm(); 
  form.parse(req, function(err, fields, files){ 
      var oldPath = files.content.path; 
      var newPath = path.join(constants.appRoot.path, 'public/uploads') 
              + '/'+files.content.name 
      var rawData = fs.readFileSync(oldPath) 
    
      fs.writeFileSync(newPath, rawData) 

      var oldPath = files.style.path; 
      var newPath = path.join(constants.appRoot.path, 'public/uploads') 
              + '/'+files.style.name 
      var rawData = fs.readFileSync(oldPath) 
    
      fs.writeFileSync(newPath, rawData) 
      res.json({file: "/uploads/deepart.jpg"}) 
  });}
  setTimeout(fun, 3000);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  // form.on('file', function(field, file) {
  //   fs.rename(file.path, path.join("public/upload/", file.name),function (err) {
  //     if (err) throw err;
  //   });
  // }); 
  
  // form.on('error', function(err) {
  //   console.log('A file upload error has occured: \n' + err);
  // }); 
  // form.on('end', function() {
  //   setTimeout((function() {res.json(tree(form.uploadDir, {exclude: excludePaths}))}), 800);
  // }); 
  
  // parse the incoming request containing the form data
  // form.parse(req);
});

module.exports = router;