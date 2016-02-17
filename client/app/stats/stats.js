angular.module('fridgeKeep.stats', ['fridgeKeep.services'])

.controller('StatsController', function ($scope, Auth, UserActions) {
  $scope.signout = Auth.signout;
  $scope.goal = 25;

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

  $scope.updateLineChart = function () {
    $('#lineChart').empty();
    $scope.lineChart();
  };

  $scope.getDataByMonth = function () {
    var dataByMonth = {};
    for(var i = 0; i < $scope.trash.length; i++) {
      var item = $scope.trash[i];
      var date = new Date(item.dateFinished);
      var month = (date.getMonth() + 1).toString();
      if(month.length < 2) {
        month = '0' + month;
      }
      var year = date.getFullYear().toString();
      var yearmonth = '' + year + month;
      dataByMonth[yearmonth] = dataByMonth[yearmonth] || {date:month + '/' + year, trashVal:0, 
                                                         trashQty:0, stomachVal:0, stomachQty:0};
      dataByMonth[yearmonth].trashVal += item.value;
      dataByMonth[yearmonth].trashQty += item.qty;
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
      dataByMonth[yearmonth] = dataByMonth[yearmonth] || {date:year + '-' + month, trashVal:0, 
                                                         trashQty:0, stomachVal:0, stomachQty:0};
      dataByMonth[yearmonth].stomachVal += item.value;
      dataByMonth[yearmonth].stomachQty += item.qty;
    }
    $scope.dataByMonth = dataByMonth;
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
    var dataByMonth = $scope.dataByMonth;
    var data = [];
    for(key in dataByMonth) {
      var month = dataByMonth[key];
      var entry = {month:month.date, trashValue:month.trashVal, stomachValue:month.stomachVal};
      data.push(entry);
    }
    new Morris.Line({
      element: 'lineChart',
      data: data,
      xkey: 'month',
      ykeys: ['trashValue', 'stomachValue'],
      labels: ['Wasted', 'Eaten'],
      hideHover:true,
      yLabelFormat:function (y) { return '$' + y.toFixed(2); },
      goals: [$scope.goal],
      goalStrokeWidth: 2,
      goalLineColors: ['steelblue']
    });
  };

  $scope.getInfo();
});



