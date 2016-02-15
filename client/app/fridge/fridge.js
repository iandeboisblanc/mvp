angular.module('fridgeKeep.fridge', [])

.controller('FridgeController', function ($scope) {
  $scope.item = {};
  $scope.addItem = function () {
    fridgeStorage.push(JSON.parse(JSON.stringify($scope.item)));
    $scope.item.name = '';
    $scope.item.expDate = '';
  };
});