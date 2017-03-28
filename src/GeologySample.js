'use strict';

function GeologySample( $q, GeologySampleResource) {
  'ngInject';


  GeologySampleResource.create = function() {

      let lang = 'en';
      let collection = "geology";
      let schema = 'http://api.npolar.no/schema/geology-sample';

      let e = {  lang, collection, schema };
      console.debug(e);

      return e;

    };

     // The hashi (v0) file object should be object with keys filename, url...
    GeologySampleResource.hashiObject = function(file) {
       console.debug('hashiObject', file);
      return {
        url: file.uri,
        filename: file.filename,
        // icon
        length: file.file_size,
        md5sum: (file.hash||'md5:').split('md5:')[1],
        content_type: file.type
      };
    };



    GeologySampleResource.fileObject = function(hashi) {
      console.debug('fileObject', hashi);
      return {
        uri: hashi.url,
        filename: hashi.filename,
        length: hashi.file_size,
        hash: 'md5:'+hashi.md5sum,
        type: hashi.content_type
     };
   };



  return GeologySampleResource;



}
module.exports = GeologySample;