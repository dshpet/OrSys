'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('orSysApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('ngAnimate'));

  var DashboardCtrl, scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/dataReceivers')
     .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

  
  it('should attach a list of userdata to the scope', function () {
    $httpBackend.flush();
    expect(scope.userData.length).toBe(4);
  });
});
