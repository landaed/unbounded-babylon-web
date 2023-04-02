var express = require("express");
var app     = express();
var path    = require("path");

// Set the content-type for JavaScript files to 'text/javascript'
express.static.mime.types['js'] = 'text/javascript';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname+ '/public')));

// Serve the index.html file
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(3000);

console.log("Running at Port 3000");
