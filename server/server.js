var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = require('./config/db');
var userController = require('./users/userController.js');
var fridgeController = require('./users/userController.js');
var jwt = require('jwt-simple');

var app = express();

var port = process.env.PORT || 8080; 

// connect to mongo database named "shortly"
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
app.post('/api/users/signin', userController.signin);
app.post('/api/users/signup', userController.signup);
app.get('/api/users/signedin', userController.checkAuth);

app.use('/api/', function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }
    try {
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
});
app.get('/api/fridge/', userController.getUserInfo);
app.post('/api/fridge/', userController.addNewItem);
app.post('/api/done/', userController.finishItem);
app.post('/api/remove/', userController.removeItem);
app.post('/api/goal/', userController.updateGoal);


// start listening to requests on port
app.listen(port);
console.log('Listening on port', port);

// export our app for testing and flexibility, required by index.js
module.exports = app;