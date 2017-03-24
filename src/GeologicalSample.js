'use strict';

function GeologicalSample( $q, GeologicalSampleResource) {
  'ngInject';


  GeologicalSampleResource.create = function() {

      let lang = 'en';
      let collection = "geology";
     // let schema = 'http://api.npolar.no/schema/geology-sample';

      let e = {  lang, collection };
      console.debug(e);

      return e;

    };



  return GeologicalSampleResource;



}
module.exports = GeologicalSample;