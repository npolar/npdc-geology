"use strict";

module.exports = function($resource, npolarApiConfig) {
  'ngInject';

  const TIMEOUT = 20000;

  // Default parameters
  let params = {
    id: null,
    limit: 100,
    format: 'json',
    q: '',
    sort: 'native',
    variant: 'array'
  };

  let headers = {
    Accept: 'application/json'
  };

  let actions = {
    feed: {
      method: 'GET',
      params,
      headers,
      cache: true,
      isArray: true,
      timeout: TIMEOUT,
    },
    fetch: {
      method: 'GET',
      headers,
      cache: true,
      timeout: TIMEOUT
    }
  };

  let Country = $resource(npolarApiConfig.base + '/country', {}, actions);
  let Language = $resource(npolarApiConfig.base + '/language', {}, actions);

  return {
    countriesByQuery(q = '') {
      return Country.feed({q});
    },
    countryByCode(code) {
      return Country.fetch({'filter-code': code});
    },
    countryByName(name) {
      return Country.fetch({'filter-name': name});
    },
    countryByNative(native) {
      return Country.fetch({'filter-native': native});
    },
    languagesByQuery(q = '') {
      return Language.feed({q});
    },
    languageByCode(code) {
      return Language.fetch({'filter-code': code});
    },
    languageByName(name) {
      return Language.fetch({'filter-name': name});
    },
    languageByNative(native) {
      return Language.fetch({'filter-native': native});
    }
  };
};
