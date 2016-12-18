var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(__dirname + './chat-online.html'));
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
  res.render('./chat-online.html');
});

app.listen(process.env.PORT || 4000);
