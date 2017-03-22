'use strict';

module.exports = function() {
  'ngInject';

  return function(input) {
    if (input && (/^[0-9]{4}[-][0-9]{2}[-][0-9]{2}T/).test(input)) {
      return input.split("T")[0];
    } else {
      return input;
    }
  };
};
