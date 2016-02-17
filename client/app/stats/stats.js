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
      $scope.getDataByMonth();
      $scope.pieChart();
      $scope.lineChart();
    });
  };

  $scope.getDataByMonth = function () {
    var trashMonths = {};
    var stomachMonths = {};
    for(var i = 0; i < $scope.trash.length; i++) {
      var item = $scope.trash[i];
      var date = new Date(item.dateFinished);
      var month = (date.getMonth() + 1).toString();
      if(month.length < 2) {
        month = '0' + month;
      }
      var year = date.getFullYear().toString();
      var yearmonth = '' + year + month;
      trashMonths[yearmonth] = trashMonths[yearmonth] || {date:month + '/' + year, value:0, qty:0};
      trashMonths[yearmonth].value += item.value;
      trashMonths[yearmonth].qty += item.qty;
    }
    for(var i = 0; i < $scope.stomach.length; i++) {
      var item = $scope.stomach[i];
      var date = new Date(item.dateFinished);
      var month = (date.getMonth() + 1).toString();
      if(month.length < 2) {
        month = '0' + month;
      }
      var year = date.getFullYear().toString();
      var yearmonth = '' + year + month;
      stomachMonths[yearmonth] = stomachMonths[yearmonth] || {date:month + '/' + year, value:0, qty:0};
      stomachMonths[yearmonth].value += item.value;
      stomachMonths[yearmonth].qty += item.qty;
    }
    $scope.trashMonths = trashMonths;
    $scope.stomachMonths = stomachMonths;
  };
  
  $scope.pieChart = function () {
    new Morris.Donut({
      element: 'pieChart',
      data: [
        { label: 'Eaten', value:$scope.eatenQty / $scope.consumedQty * 100},
        { label: 'Trashed', value:$scope.trashedQty / $scope.consumedQty * 100 }
      ],
      formatter: function (y, data) { return y.toFixed(1) + '%' } 
    });
  };

  $scope.lineChart = function () {
    var trashMonths = $scope.trashMonths;
    var data = [];
    for(key in trashMonths) {
      var entry = {month:trashMonths[key].date, value:trashMonths[key].value};
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



