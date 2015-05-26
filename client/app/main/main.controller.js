'use strict';

angular.module('orSysApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/dataReceivers').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('dataReceiver', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/dataReceivers', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/dataReceivers/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('dataReceiver');
    });
  });
