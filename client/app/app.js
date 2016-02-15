angular.module('fridgeKeep', [
  'ngRoute',
  'fridgeKeep.fridge'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/fridge/fridge.html',
      controller: 'FridgeController'
    })
    .otherwise({
      redirectTo: '/' 
    });
})