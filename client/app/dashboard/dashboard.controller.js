'use strict';

angular.module('orSysApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.message = 'Hello';
    $scope.user;
    $scope.userData = [];
    var current = Auth.getCurrentUser().$promise.then(function(res){
    	$scope.user = res;

      updateData();
    }, function(err){
    	console.log(err);
    });

    var updateData = function() {
      $http.get('/api/dataReceivers/googleId/' + $scope.user.google.id).success(function(dataReceiver) {
        $scope.userData = dataReceiver;
        socket.syncUpdates('data', $scope.userData);
      });
    };
    var timer = setInterval(function() {
      $scope.$apply(updateData);
    }, 1000);  
  });
