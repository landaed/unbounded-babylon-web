var express = require("express");
var app     = express();
var path    = require("path");
var mime    = require("mime");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname + '/public'), {
  setHeaders: function (res, path) {
    if (mime.getType(path) === 'text/javascript') {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Serve the index.html file
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(3000);

console.log("Running at Port 3000");
