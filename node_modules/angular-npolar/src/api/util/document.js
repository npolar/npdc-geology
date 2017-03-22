'use strict';

let Entities = require('special-entities');

let documentUtil = function($filter) {
  'ngInject';

  let unescape = function(text) {
    return Entities.normalizeEntities(text, 'utf-8');
  };

  let title = function(entry) {

    if (!entry) {
      return;
    }
    let t;
    if (entry.title instanceof Object) {
      t = $filter('i18n')(entry.title);
    } else {
      t = entry.title || entry.name || entry.code || entry.id;
    }
    return unescape(t);
  };

  return {
    title
  };
};

module.exports = documentUtil;
