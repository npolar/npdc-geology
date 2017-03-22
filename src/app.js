'use strict';
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');

var npdcGeologicalSampleApp = angular.module('npdcGeologicalSampleApp', ['npdcCommon','leaflet']);

npdcGeologicalSampleApp.controller('GeologicalSampleShowController', require('./show/GeologicalSampleShowController'));
npdcGeologicalSampleApp.controller('GeologicalSampleSearchController', require('./search/GeologicalSampleSearchController'));
npdcGeologicalSampleApp.controller('GeologicalSampleEditController', require('./edit/GeologicalSampleEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset'},
  {'path': '/project', 'resource': 'Project'},
  {'path': '/expedition', 'resource': 'Expedition'},
  {'path': '/publication', 'resource': 'Publication'},
  {'path': '/geology/sample', 'resource': 'GeologicalSample'}
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcGeologicalSampleApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
  return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcGeologicalSampleApp.config(require('./router'));

npdcGeologicalSampleApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("production");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcGeologicalSampleApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  NpolarTranslate.loadBundles('npdc-geology');
  npdcAppConfig.toolbarTitle = 'Geological samples archive from the Norwegian polar areas';
});
