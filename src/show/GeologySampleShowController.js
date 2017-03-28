'use strict';

var GeologySampleShowController = function($controller, $routeParams,
  $scope, $q, GeologySample, npdcAppConfig, Dataset, Publication, Project) {
    'ngInject';


  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = GeologySample;



/*
  let uri = (geologicalSample) => {
    let link = geologicalSample.links.find(l => {
      return l.rel === "alternate" && (/html$/).test(l.type);
    });
    if (link) {
      return link.href.replace(/^http:/, "https:");
    } else {
      return `https://data.npolar.no/geology/sample/${ geologicalSample.id }`;
    }
  };
*/



  //Show map in Antarctica
  $scope.mapOptions = {};
  $scope.mapOptions.color = "#FF0000";


  let show = function() {

    $scope.show().$promise.then((geologySample) => {

      //Overlay the map with lat,lng
      $scope.mapOptions.coverage = [[[geologySample.latitude,geologySample.longitude],[geologySample.latitude,geologySample.longitude]]];
      $scope.mapOptions.geojson = "geojson";

      $scope.document.lithology =  convert($scope.document.lithology);

    });

  };

  show();

};

/* convert from camelCase to lower case text*/
function convert(str) {
       var  positions = '';

       for(var i=0; i<(str).length; i++){
           if(str[i].match(/[A-Z]/) !== null){
             positions += " ";
             positions += str[i].toLowerCase();
        } else {
            positions += str[i];
        }
      }
        return positions;
}

module.exports = GeologySampleShowController;
