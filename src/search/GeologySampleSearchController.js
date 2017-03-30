'use strict';


var GeologySampleSearchController = function ($scope, $location, $controller, $filter, NpolarApiSecurity, GeologySample, npdcAppConfig,  NpdcSearchService, NpolarTranslate) {
  'ngInject';

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = GeologySample;

   npdcAppConfig.search.local.results.detail = (entry) => {
     let r = (entry.title) + " - " +(entry.placename) + ", " + (entry.collected_year);
     return r;
 };


  npdcAppConfig.cardTitle = "Geological samples archive from the Norwegian polar areas";
  npdcAppConfig.search.local.results.subtitle = "type";


  let query = function() {
    let defaults = {
      limit: "50",
      sort: "-draft='no',updated", //non-drafts should be viewed first
      fields: 'lithology,title,id,collected_year,collection,@placename,files,draft',
      facets: 'lithology,title,collected_year'};

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

