var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);


module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('Attempted Sign in with',username,password);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePassword(password, function (err, foundUser) {
            if(err) {
              console.error('Error with password');
            }
            if (foundUser) {
              var token = jwt.encode(user, 'secret');
              console.log('Successful login');
              res.json({token: token});
            } else {
              return next(new Error('Incorrect password'));
            }
          });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  signup: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          return createUser({
            username: username,
            password: password
          });
        }
      })
      .then(function (user) {
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  },

  getUserInfo: function (req, res, next) {
    findUser({username:req.user.username})
    .then(function (foundUser) {
      res.json(foundUser);
    })
  },

  updateGoal: function (req, res, next) {
    findUser({username:req.user.username})
    .then(function (foundUser) {
      User.findByIdAndUpdate(foundUser._id,
        {$set: {'goal': req.body.goal}},
        {safe: true, upsert: true},
        function (err, model) {
          if(err) {
            console.log(err)
          }
      });
    });
  },

  addNewItem: function (req, res, next) {
    findUser({username:req.user.username})
    .then(function (foundUser) {
      User.findByIdAndUpdate(
        foundUser._id,
        {$push: {'fridge': req.body}},
        {safe: true, upsert: true},
        function (err, model) {
          if(err) {
            console.log(err)
          }
      });
    });
  },

  removeItem: function (req, res, next) {
    var item = req.body;
    findUser({username:req.user.username})
    .then(function (foundUser) {
      for(var i = 0; i < foundUser.fridge.length; i++) {
        if(foundUser.fridge[i].name === item.name && foundUser.fridge[i].expDate === item.expDate) {
          foundUser.fridge.splice(i,1);
          break;
        }
      }
      foundUser.save(function (err, model) {
        if(err) {
          console.error('Error saving fridge');
        } else {
          res.send(model);
        }
      });
    });
  },

  finishItem: function (req, res, next) {
    findUser({username:req.user.username})
    .then(function (foundUser) {
      var item = req.body.item;
      var perc = req.body.percentFinished;
      delete item['$$hashKey'];
      delete item['index'];
      var pushObj = {};
      var trashItem = JSON.parse(JSON.stringify(item));
      trashItem.qty = (100 - perc) / 100;
      trashItem.value = trashItem.qty * item.value;
      var stomachItem = JSON.parse(JSON.stringify(item));
      stomachItem.qty = perc / 100;
      stomachItem.value = stomachItem.qty * item.value;
      if(perc === 100) {
        pushObj = {'stomach':stomachItem}
      } else if(perc === 0) {
        pushObj = {'trash':trashItem}
      } else {
        pushObj = {'trash':trashItem, 'stomach':stomachItem}
      }
      User.findByIdAndUpdate(
        foundUser._id,
        {$push: pushObj},
        {safe: true, upsert: true},
        function (err, model) {
          if(err) {
            console.log(err)
          } else {
            for(var i = 0; i < model.fridge.length; i++) {
              if(model.fridge[i].name === item.name && model.fridge[i].expDate === item.expDate) {
                model.fridge.splice(i,1);
                break;
              }
            }
            model.save(function (err, model) {
              if(err) {
                console.error('Error saving fridge');
              } else {
                res.send(model);
              }
            });
          }
      });
    })
  }
};