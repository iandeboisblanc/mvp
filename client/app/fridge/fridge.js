angular.module('fridgeKeep.fridge', ['fridgeKeep.services'])

.controller('FridgeController', function ($scope, Auth, UserActions) {
  $scope.item = {};
  $scope.storage = [];
  $scope.signout = Auth.signout;

  $scope.addItem = function () {
    UserActions.addFridgeItem($scope.item);
    $scope.item.name = '';
    $scope.item.expDate = '';
    $scope.getFridgeItems();
  };

  $scope.getFridgeItems = function () {
    UserActions.getUserInfo()
    .then(function (info) {
      $scope.storage = info.fridge;
      $scope.storage.sort(function (a,b) {
        return new Date(a.expDate) - new Date(b.expDate);
      })
    })
  };

  $scope.getColor = function (item) {
    var color = 'rgba(50,50,230,0.5)';
    var daysToExpiry = $scope.daysToExpiry(item.expDate);
    if(daysToExpiry < 7) {
      color = 'rgba(' + ((Math.min((7 - daysToExpiry),7) * 25) + 50) + ', 50, ' + (Math.max(daysToExpiry, 0) * 20 + 50) + ', 0.5)';
    }
    return {'background-color':color};
  };

  $scope.daysToExpiry = function (expDate) {
    return Math.floor((new Date(expDate) - new Date()) / 1000 / 60 / 60 / 24);
  };

  $scope.removeItem = function (item) {
    //call UserActionsRemove
  };

  $scope.finishActiveItem = function (percentage) {
    console.log('finishing...', window.activeItem.name, 'at this %:', percentage);
    UserActions.finishItem(window.activeItem, percentage)
    .then(function () {
      $scope.getFridgeItems();
    });
  };

  $scope.makeActive = function (item, index) {
    window.activeItem = item;
    window.activeItem.index = index;
  };

  $scope.getFridgeItems();
  $('#theModal').on('hidden.bs.modal', function (e) {
    var percentage = $('#percentSlider').val()
    $scope.finishActiveItem(percentage);
  })
});
