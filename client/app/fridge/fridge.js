angular.module('fridgeKeep.fridge', [])

.controller('FridgeController', function ($scope) {
  $scope.item = {};
  $scope.storage = fridgeStorage;
  $scope.addItem = function () {
    fridgeStorage.push(JSON.parse(JSON.stringify($scope.item)));
    $scope.item.name = '';
    $scope.item.expDate = '';
  };
  $scope.getColor = function (item) {
    var color = 'rgb(0,0,230)';
    var daysToExpiry = Math.floor((new Date(item.expDate) - new Date()) / 1000 / 60 / 60 / 24);
    console.log(daysToExpiry);
    if(daysToExpiry < 7) {
      color = 'rgb(' + (Math.min((7 - daysToExpiry),7) * 30) + ', 0, ' + (Math.max(daysToExpiry, 0) * 30) + ')';
      console.log(color);
    }
    return {'background-color':color};
  }
});