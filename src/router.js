'use strict';

var router = function($routeProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/sample/:id', {
    templateUrl: 'show/show-geological-sample.html',
    controller: 'GeologicalSampleShowController'
  }).when('/sample/:id/edit', {
    template: '<npdc:formula></npdc:formula>',
    controller: 'GeologicalSampleEditController'
  }).when('/sample', {
    templateUrl: 'search/search.html',
    controller: 'GeologicalSampleSearchController',
    reloadOnSearch: false
  }).when('/', {
   redirectTo: '/sample'
  });
};

module.exports = router;
