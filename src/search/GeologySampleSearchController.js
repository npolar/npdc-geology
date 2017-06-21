'use strict';


var GeologySampleSearchController = function ($http, $scope, $location, $controller, $filter, NpolarApiSecurity, GeologySample, npdcAppConfig,  NpdcSearchService, NpolarTranslate) {
  'ngInject';

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = GeologySample;

   npdcAppConfig.search.local.results.detail = (entry) => {
     let r = (entry.title) + " - " +(entry.placename) + ", " + (entry.collected_year);
     return r;
 };

  npdcAppConfig.search.local.results.subtitle = "type";

  $scope.showNext = function() {
    if (!$scope.feed) {
      return false;
    }
    return ($scope.feed.entries.length < $scope.feed.opensearch.totalResults);
  };

  $scope.next = function() {
    if (!$scope.feed.links) {
      return;
    }

    let nextLink = $scope.feed.links.find(link => { return (link.rel === "next"); });
    if (nextLink.href) {
      $http.get(nextLink.href.replace(/^https?:/, '')).success(function(response) {
        response.feed.entries = $scope.feed.entries.concat(response.feed.entries);
        $scope.feed = response.feed;
      });
    }
  };

  let query = function() {

      let defaults;

      defaults = {
          limit: "50",
          sort: "-draft='no',title", //non-drafts should be viewed first
          fields: 'lithology,title,id,collected_year,collection,@placename,files,draft',
          facets: 'lithology,collected_year'};

  /*     defaults = {
          limit: "50",
          filter: "draft='no'", //non-drafts should be viewed first
          sort: "updated",
          fields: "lithology,title,id,collected_year,collection,@placename,files,draft",
          facets: 'lithology,collected_year'
          }; */

    let invariants = $scope.security.isAuthenticated() ? {} : {} ;
    return Object.assign({}, defaults, invariants);
    };


  $scope.search(query());

  $scope.security = NpolarApiSecurity;
  $scope.base_user = NpolarApiSecurity.canonicalUri('/geology');


  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = GeologySampleSearchController;

