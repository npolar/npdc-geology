'use strict';
let angular = require('angular');

let ngNpolar = angular.module('ngNpolar');
ngNpolar.constant('npolarApiConfig', require('./config'));


let people = require('./people');
let aliases = require('./aliases');

/*
let idx;
aliases.forEach(a => {
  idx = people.findIndex(p => p.email === a.email);
  if (idx >= 0) {
    people[idx].alias = a.alias;
    console.log(idx, people[idx]);
  } else {
    people.push(a);
  }
  
});
*/
ngNpolar.constant('npolarPeople', people);
ngNpolar.constant('npolarAliases', aliases);

ngNpolar.service('NpolarApiUser', require('./session/User'));
ngNpolar.service('NpolarApiRequest', require('./http/Request'));

ngNpolar.service('NpolarApiSecurity', require('./http/Security'));
ngNpolar.service('NpolarApiResource', require('./http/Resource'));
ngNpolar.factory('npolarApiInterceptor', require('./http/HttpInterceptor'));

ngNpolar.service('NpolarApiText', require('./util/Text'));
ngNpolar.service('npolarDocumentUtil', require('./util/document'));
ngNpolar.directive('npolarJsonText', require('./util/jsonText'));

ngNpolar.controller('NpolarBaseController', require('./controller/BaseController'));
ngNpolar.controller('NpolarEditController', require('./controller/EditController'));

ngNpolar.service('Gouncer', require('./gouncer/GouncerService'));
