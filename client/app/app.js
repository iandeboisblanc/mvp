angular.module('fridgeKeep', [
  'ngRoute',
  'fridgeKeep.fridge',
  'fridgeKeep.auth'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/fridge/fridge.html',
      controller: 'FridgeController'
    })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html'
      controller: 'AuthController'
    })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html'
      controller: 'AuthController'
    })
    .otherwise({
      redirectTo: '/' 
    });
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

var fridgeStorage = [];