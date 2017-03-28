'use strict';

var router = function($routeProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/sample/:id', {
    templateUrl: 'show/show-geology-sample.html',
    controller: 'GeologySampleShowController'
  }).when('/sample/:id/edit', {
    template: '<npdc:formula></npdc:formula>',
    controller: 'GeologySampleEditController'
  }).when('/sample', {
    templateUrl: 'search/search.html',
    controller: 'GeologySampleSearchController',
    reloadOnSearch: false
  }).when('/', {
   redirectTo: '/sample'
  });
};

module.exports = router;
