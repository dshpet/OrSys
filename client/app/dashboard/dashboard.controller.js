'use strict';

angular.module('orSysApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.message = 'Hello';
    $scope.user = {};
    $scope.userData = [];
    var current = Auth.getCurrentUser().$promise.then(function(res){
    	$scope.user = res;

      console.log("url : " + '/api/dataReceivers/googleId/' + res.google.id);
      $http.get('/api/dataReceivers/googleId/' + res.google.id).success(function(dataReceiver) {
        $scope.userData = dataReceiver;
        socket.syncUpdates('data', $scope.userData);
      });
    }, function(err){
    	console.log(err);
    });;    
  });
