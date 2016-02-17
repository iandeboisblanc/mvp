angular.module('fridgeKeep.services', [])

.factory('UserActions', function ($http) {
  var fac = {};
  fac.getUserInfo = function () {
    return $http({
      method: 'GET',
      url: '/api/fridge'
    }).then(function (response) {
      return response.data;
    });
  };
  fac.addFridgeItem = function (fridgeItem) {
    console.log('about to send a stringified version of..', fridgeItem);
    return $http({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(fridgeItem),
      url: '/api/fridge'
    });
  };
  fac.finishItem = function (fridgeItem, percentFinished) {
    return $http({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({item:fridgeItem, percentFinished:percentFinished}),
      url: '/api/done'
    }).then(function (response) {
      return response.data;
    });
  }
  fac.removeItem = function (fridgeItem) {
    return $http({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(fridgeItem),
      url: '/api/remove'
    });
  }
  fac.setGoal = function (goal) {
    return $http({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({goal}),
      url: '/api/goal'
    });
  }
  return fac;
})

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.fridgeKeep');
  };

  var signout = function () {
    console.log('Signing Out!')
    $window.localStorage.removeItem('com.fridgeKeep');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});