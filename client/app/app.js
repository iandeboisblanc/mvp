angular.module('fridgeKeep', [
  'ngRoute',
  'fridgeKeep.fridge',
  'fridgeKeep.stats',
  'fridgeKeep.auth',
  'fridgeKeep.services',
  'angular.filter'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/fridge', {
      templateUrl: 'app/fridge/fridge.html',
      controller: 'FridgeController',
      authenticate: true
    })
    .when('/stats', {
      templateUrl: 'app/stats/stats.html',
      controller: 'StatsController',
      authenticate: true
    })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .otherwise({
      redirectTo: '/fridge' 
    });
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.fridgeKeep');
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

