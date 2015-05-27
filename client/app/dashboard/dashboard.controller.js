'use strict';

angular.module('orSysApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.message = 'Hello';
    $scope.user = {};
    $scope.userData = [];
    var current = Auth.getCurrentUser().$promise.then(function(res){
    	$scope.user = res;
    }, function(err){
    	console.log(err);
    });;

    $http.get('/api/dataReceivers').success(function(dataReceiver) {
      $scope.userData = dataReceiver;
      socket.syncUpdates('data', $scope.userData);
    });
  });
