var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = require('./config/db');

var app = express();


var port = process.env.PORT || 8080; 

// connect to mongo database named "shortly"
// mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'))

// configure our server with all the middleware and routing
// require('./config/routes.js')(app, express);

// start listening to requests on port
app.listen(port);
console.log('Listening on port', port);

// export our app for testing and flexibility, required by index.js
module.exports = app;