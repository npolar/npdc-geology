'use strict';

module.exports = function(npolarPeople, npolarAliases) {
  'ngInject';

  return function(email) {
    let name;

    // Alias?
    let a = npolarAliases.find(a => a.alias.includes(email));
    if (a) {
      if (a.name) {
        name = a.name; // Name found
      } else {
        email = a.email; // Lookup in next block
      }
    }

    if (typeof(name) !== 'string') { // Not alias with name property
      // In people <= Person API?
      let p = npolarPeople.people.find(p => p.email === email);
      if (p) {
        if (p.first_name && p.last_name) {
          name = `${p.first_name} ${p.last_name}`;
        }
      }
    }

    if (typeof(name) !== 'string') {
      // Bail out => return input
      name = email;
    }
    return name;
  };
};