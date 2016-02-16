angular.module('fridgeKeep.stats', ['fridgeKeep.services'])

.controller('StatsController', function ($scope, Auth, UserActions) {
  $scope.signout = Auth.signout;
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
      $scope.lineChart();
    });
  }
  $scope.pieChart = function() {
    new Morris.Donut({
      element: 'pieChart',
      data: [
        { label: 'Eaten', value:$scope.eatenQty / $scope.consumedQty * 100},
        { label: 'Trashed', value:$scope.trashedQty / $scope.consumedQty * 100 }
      ],
      formatter: function (y, data) { return y.toFixed(1) + '%' } 
    });
  };
  $scope.lineChart = function() {
    var trashMonths = {};
    var stomachMonths = {};
    for(var i = 0; i < $scope.trash.length; i++) {
      var date = new Date($scope.trash[i].dateFinished);
      var month = date.getMonth();
      var year = date.getFullYear();
      var monthyear = '' + month + year;
      trashMonths[monthyear] ? trashMonths[monthyear] += $scope.trash[i].value : trashMonths[monthyear] = $scope.trash[i].value;
    }
    for(var i = 0; i < $scope.stomach.length; i++) {
      var date = new Date($scope.stomach[i].dateFinished);
      var month = date.getMonth();
      var year = date.getFullYear();
      var monthyear = '' + month + year;
      stomachMonths[monthyear] ? stomachMonths[monthyear] += $scope.stomach[i].value : stomachMonths[monthyear] = $scope.stomach[i].value;
    }
    var data = [];
    for(key in trashMonths) {
      var keyArr = key.split('');
      var year = keyArr.splice(-4,4).join('');
      var entry = {month:(Number(keyArr[0]) + 1) + '/' + year, value:trashMonths[key]};
      data.push(entry);
    }
    new Morris.Line({
      element: 'lineChart',
      data: data,
      xkey: 'month',
      ykeys: ['value'],
      labels: ['Wasted food'],
      yLabelFormat:function (y) { return '$' + y.toFixed(2); }
    });
  };
  $scope.getInfo();
 });



