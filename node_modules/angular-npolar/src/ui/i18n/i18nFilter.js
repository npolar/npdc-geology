'use strict';
// Use the i18n filter to get a string from JSON-LD style i18n Array or Object
let i18nFilter = function(NpolarTranslate, NpolarLang) {
  'ngInject';

  let filter = function(text, language=NpolarLang.getLang(), key = { value: '@value', language: '@language' }) {
    if (!text) {
      return;
    }

    if (text instanceof Array && text.length > 0) {
      if (text.length > 0) {
        if (text[0][key.value]) {
          return text[0][key.value];
        } else {
          return JSON.stringify(text[0]);
        }
      }

    } else if (text instanceof Object){
      if (text[language]) {
        return text[language];
      } else {
        let k = Object.keys(text);
        if (k && k[0] && text[k[0]]) {
          return text[k[0]];
        }
      }
    } else if (typeof(text) === 'string') {
      return NpolarTranslate.translate(text, NpolarLang.getLang());
    }
  };

  //filter.$stateful=true;
  return filter;

};
module.exports = i18nFilter;
