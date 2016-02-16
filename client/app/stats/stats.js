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
      $scope.eatenQty = $scope.stomach.reduce(function (accumulator, current) {
        return accumulator + current.qty;
      }, 0)
      $scope.eatenVal = $scope.stomach.reduce(function (accumulator, current) {
        return accumulator + current.value;
      }, 0)
      $scope.trashedQty = $scope.trash.reduce(function (accumulator, current) {
        return accumulator + current.qty;
      }, 0)
      $scope.trashedVal = $scope.trash.reduce(function (accumulator, current) {
        return accumulator + current.value;
      }, 0)
      $scope.expiringQty = $scope.fridge.reduce(function (accumulator, current) {
        if($scope.daysToExpiry(current.expDate) <= 7) {
          accumulator++;
        }
        return accumulator;
      }, 0)
      $scope.consumedQty = $scope.trashedQty + $scope.eatenQty;
      $scope.pieChart();
    });
  }
  $scope.pieChart = function() {
    console.log($scope.eatenQty, $scope.consumedQty, 100);
    new Morris.Donut({
      // ID of the element in which to draw the chart.
      element: 'pieChart',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: [
        { label: 'Eaten', value:$scope.eatenQty / $scope.consumedQty * 100},
        { label: 'Trashed', value:$scope.trashedQty / $scope.consumedQty * 100 }
      ],
      formatter: function (y, data) { return y.toFixed(1) + '%' } 
    });
  }
  $scope.getInfo();
 });



