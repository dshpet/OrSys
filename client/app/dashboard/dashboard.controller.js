'use strict';

angular.module('orSysApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.showDetails = false;
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
        socket.syncUpdates('dataReceiver', $scope.userData);
      });
    };
  });
