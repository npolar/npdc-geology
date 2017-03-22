'use strict';

function Request(NpolarApiSecurity) {
  
  'ngInject';
  
  let self = this;
  
  this.factory = () => new XMLHttpRequest();
  
  this.head = (request, uri, listener, event='load') => {
    request.addEventListener(event, listener);
    request.open('HEAD', uri);
    request.setRequestHeader('Authorization', NpolarApiSecurity.authorization());
    request.send();
  };
  
  this.request = (verb, uri, headers=self.headers(), listeners=[{ event: 'load', handler: null}]) => {
    
  };
}
module.exports = Request;