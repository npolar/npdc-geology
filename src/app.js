'use strict';
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');

var npdcGeologySampleApp = angular.module('npdcGeologySampleApp', ['npdcCommon','leaflet']);

npdcGeologySampleApp.controller('GeologySampleShowController', require('./show/GeologySampleShowController'));
npdcGeologySampleApp.controller('GeologySampleSearchController', require('./search/GeologySampleSearchController'));
npdcGeologySampleApp.controller('GeologySampleEditController', require('./edit/GeologySampleEditController'));
npdcGeologySampleApp.directive('geologySampleCoverage', require('./edit/coverage/coverageDirective'));
npdcGeologySampleApp.factory('GeologySample', require('./GeologySample.js'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset'},
  {'path': '/project', 'resource': 'Project'},
  {'path': '/expedition', 'resource': 'Expedition'},
  {'path': '/publication', 'resource': 'Publication'},
  {'path': '/geology/sample', 'resource': 'GeologySampleResource'}
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcGeologySampleApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
  return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcGeologySampleApp.config(require('./router'));

npdcGeologySampleApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("production");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcGeologySampleApp.run(( npdcAppConfig, NpolarTranslate) => {
  npdcAppConfig.help = { uri: 'https://github.com/npolar/npdc-geology/wiki' };
  NpolarTranslate.loadBundles('npdc-geology');
});

//  NpolarTranslate.loadBundles('npdc-geology');
//  npdcAppConfig.toolbarTitle = NpolarTranslate.translate('Norwegian polar geological sample archive');
//});
