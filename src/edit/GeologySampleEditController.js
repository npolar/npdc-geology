'use strict';

var GeologySampleEditController = function($scope, $controller, $routeParams, GeologySample, formula,
  formulaAutoCompleteService, npdcAppConfig, chronopicService, fileFunnelService, NpolarLang, npolarApiConfig,
  NpolarApiSecurity, npolarCountryService, NpolarMessage) {
  'ngInject';

   function init() {

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  // GeologySample -> npolarApiResource -> ngResource
  $scope.resource = GeologySample;

  let templates = [];

  let i18n = [
  //{
  //    map: require('./en.json'),
  //    code: 'en'
  //  },
    {
      map: require('./no.json'),
      code: 'nb_NO',
    }];

  $scope.formula = formula.getInstance({
    schema: '//api.npolar.no/schema/geology-sample',
    form: 'edit/formula.json',
    language: NpolarLang.getLang(),
    templates: npdcAppConfig.formula.templates.concat(templates),
    languages: npdcAppConfig.formula.languages.concat(i18n)
   });

  initFileUpload($scope.formula);

  formulaAutoCompleteService.autocomplete({
    match: "@placename",
    querySource: 'https://api.npolar.no/placename',
    label: "name['@value']",
    value: 'ident'
  }, $scope.formula);

  let autocompleteFacets = ["geologist"];
  formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, GeologySample, $scope.formula);


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
      fileToValueMapper: GeologySample.fileObject,
      valueToFileMapper: GeologySample.hashiObject,
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

module.exports = GeologySampleEditController;
