angular.module('fridgeKeep.fridge', ['fridgeKeep.services'])

.controller('FridgeController', function ($scope, Auth, UserActions) {
  $scope.item = {};
  // $scope.storage = fridgeStorage;
  $scope.storage = [];
  $scope.addItem = function () {
    UserActions.addFridgeItem($scope.item);
    $scope.item.name = '';
    $scope.item.expDate = '';
    $scope.getFridgeItems();
  };
  $scope.getFridgeItems = function () {
    UserActions.getFridgeItems()
    .then(function (items) {
      $scope.storage = items;
    })
  };
  $scope.getColor = function (item) {
    var color = 'rgba(0,0,230,0.5)';
    var daysToExpiry = Math.floor((new Date(item.expDate) - new Date()) / 1000 / 60 / 60 / 24);
    if(daysToExpiry < 7) {
      color = 'rgba(' + (Math.min((7 - daysToExpiry),7) * 33) + ', 0, ' + (Math.max(daysToExpiry, 0) * 25) + ', 0.5)';
      // console.log(color);
    }
    return {'background-color':color};
  }
  $scope.signout = Auth.signout;
  $scope.getFridgeItems();
});