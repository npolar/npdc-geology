'use strict';

var GeologicalSampleShowController = function($controller, $routeParams,
  $scope, $q, GeologicalSample, npdcAppConfig, Dataset, Publication, Project) {
    'ngInject';


  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = GeologicalSample;


  let authors = (geologicalSample) => {

    var folks = [];
    var orgs = [];

    if (geologicalSample.people instanceof Array) {
      folks = geologicalSample.people.filter(p => p.roles.includes("author"));
    }

    if (folks.length === 0 && geologicalSample.organisations instanceof Array) {
      orgs = geologicalSample.organisations.filter(o => o.roles.includes("author"));
    }
    return folks.concat(orgs);

  };



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

  $scope.mapOptions = {};

  let show = function() {

    $scope.show().$promise.then((geologicalSample) => {
      $scope.document.research_type =  convert($scope.document.research_type);


      //Location on map should be the research station
      var bounds =[];
      switch($scope.document.research_station) {
        case 'sverdrup':
            bounds = [[[78.91,11.93],[78.91,11.93]]];
            break;
        case 'norvegia':
           // bounds = [[[-54.40, 3.28],[-54.40, 3.28]]];
             bounds = [[[-54.4097, 3.2886889],[-54.4097, 3.2886889]]];
            break;
        default: //troll
            bounds = [[[-72.01, 2.53],[-72.01, 2.53]]];
      }
      $scope.mapOptions.coverage = bounds;
      $scope.mapOptions.geojson = "geojson";

      $scope.links = geologicalSample.links.filter(l => (l.rel !== "alternate" && l.rel !== "edit") && l.rel !== "data");
      $scope.data = geologicalSample.links.filter(l => l.rel === "data");
      // or in files

      $scope.alternate = geologicalSample.links.filter(l => ((l.rel === "alternate") || l.rel === "edit")).concat({
        href: `https://api.npolar.no/geology/sample/?q=&filter-id=${geologicalSample.id}&format=json`,
        title: "DCAT (JSON-LD)",
        type: "application/ld+json"
      });

      $scope.authors = authors(geologicalSample).map(a => {
        if (!a.name && a.first_name) {
          a.name = `${a.first_name} ${a.last_name}`;
        }
        return a;
      });


      $scope.uri = uri(geologicalSample);

      let relatedDatasets = Dataset.array({
        q: geologicalSample.title,
        fields: 'id,title,collection',
        score: true,
        limit: 5,
        'not-id': geologicalSample.id,
        op: 'OR'
      }).$promise;
      let relatedPublications = Publication.array({
        q: geologicalSample.title,
        fields: 'id,title,published_sort,collection',
        score: true,
        limit: 5,
        op: 'OR'
      }).$promise;
      let relatedProjects = Project.array({
        q: geologicalSample.title,
        fields: 'id,title,collection',
        score: true,
        limit: 5,
        op: 'OR'
      }).$promise;

      $q.all([relatedDatasets, relatedPublications, relatedProjects]).then(related => {
        $scope.related = related;
      });

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

module.exports = GeologicalSampleShowController;
