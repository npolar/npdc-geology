'use strict';

var GeologicalSampleEditController = function($scope, $controller, $routeParams, GeologicalSample, formula,
  formulaAutoCompleteService, npdcAppConfig, chronopicService, fileFunnelService, NpolarLang, npolarApiConfig,
  NpolarApiSecurity, npolarCountryService, NpolarMessage) {
  'ngInject';

   function init() {

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  // GeologySample -> npolarApiResource -> ngResource
  $scope.resource = GeologicalSample;

  let templates = [];

  let i18n = [{
      map: require('./en.json'),
      code: 'en'
    },
    {
      map: require('./no.json'),
      code: 'nb_NO',
    }];

  $scope.formula = formula.getInstance({
    schema: '//api.npolar.no/schema/geological-sample',
    form: 'edit/formula.json',
    language: NpolarLang.getLang(),
    templates: npdcAppConfig.formula.templates.concat(templates),
    languages: npdcAppConfig.formula.languages.concat(i18n)
   });

   initFileUpload($scope.formula);

  /*formulaAutoCompleteService.autocomplete({
    match: "@placename",
    querySource: 'https://api.npolar.no/placename',
    label: 'name',
    value: 'code'
  }, $scope.formula); */

  let autocompleteFacets = ["first_name", "last_name","organisation"];
  formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, GeologicalSample, $scope.formula);


 // chronopicService.defineOptions({ match: 'released', format: '{date}'});
 // chronopicService.defineOptions({ match(field) {
 //   return field.path.match(/^#\/activity\/\d+\/.+/);
 // }, format: '{date}'});

//Set chronopic view format (this does not change the internal value, i.e. ISO string date)
 chronopicService.defineOptions({ match(field) {
    return field.path.match(/_date$/);
 }, format: '{date}'});

}


function initFileUpload(formula) {

    let server = `${NpolarApiSecurity.canonicalUri($scope.resource.path)}/:id/_file`;

    fileFunnelService.fileUploader({
      match(field) {
        return field.id === "files";
      },
      server,
      multiple: true,
      //progress: false,
       restricted: function () {
        return formula.getModel().restricted;
      },
      fileToValueMapper: GeologicalSample.fileObject,
      valueToFileMapper: GeologicalSample.hashiObject,
      fields: ['filename'] // 'type', 'hash'
    }, formula);
}

  try {
    init();

     // edit (or new) action
     $scope.edit();

  } catch (e) {
    NpolarMessage.error(e);
  }


};

module.exports = GeologicalSampleEditController;
