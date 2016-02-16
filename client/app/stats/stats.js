angular.module('fridgeKeep.stats', ['fridgeKeep.services'])

.controller('StatsController', function ($scope, Auth, UserActions) {
  $scope.daysToExpiry = function (expDate) {
    return Math.floor((new Date(expDate) - new Date()) / 1000 / 60 / 60 / 24);
  };
  $scope.getInfo = function() {
    UserActions.getUserInfo()
    .then(function (info) {
      $scope.trash = info.trash;
      $scope.stomach = info.stomach;
      $scope.fridge = info.fridge;
      $scope.eaten = $scope.stomach.reduce(function (accumulator, current) {
        return accumulator + current.qty;
      }, 0)
      $scope.trashed = $scope.trash.reduce(function (accumulator, current) {
        return accumulator + current.qty;
      }, 0)
      $scope.expiring = $scope.fridge.reduce(function (accumulator, current) {
        if($scope.daysToExpiry(current.expDate) <= 7) {
          accumulator++;
        }
        return accumulator;
      }, 0)
      $scope.consumed = $scope.trashed + $scope.eaten;
    });
  }
  $scope.getInfo();
 });