angular.module('fridgeKeep.stats', ['fridgeKeep.services'])

.controller('StatsController', function ($scope, Auth, UserActions) {
  $scope.getInfo = function() {
    UserActions.getUserInfo()
    .then(function (info) {
      $scope.trash = info.trash;
      $scope.stomach = info.stomach;
      $scope.fridge = info.fridge;
      $scope.eaten = $scope.stomach.reduce(function (accumulator, current) {
        return current.qty;
      })
    });
  }
  $scope.getInfo();
 });