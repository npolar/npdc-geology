'use strict';


var GeologicalSampleSearchController = function ($scope, $location, $controller, $filter, GeologicalSample, npdcAppConfig,  NpdcSearchService, NpolarTranslate) {
  'ngInject';

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = GeologicalSample;

   npdcAppConfig.search.local.results.detail = (entry) => {
     let r = (entry.placename) + ", " + (entry.collected_year);
     return r;
 };


  npdcAppConfig.cardTitle = "Geological samples archive from the Norwegian polar areas";
  npdcAppConfig.search.local.results.subtitle = "type";


  let query = function() {
    let defaults = {
      limit: "50",
      sort: "-updated",
      fields: 'title,id,collected_year,collection,placename',
      facets: 'title,collected_year'};

    let invariants = $scope.security.isAuthenticated() ? {} : {} ;
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = GeologicalSampleSearchController;

