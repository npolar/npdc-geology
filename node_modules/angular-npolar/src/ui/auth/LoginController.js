'use strict';

function LoginController($scope, $route,
  npolarPeople, npolarAliases, Gouncer, NpolarMessage, NpolarApiSecurity) {
  'ngInject';

  let ctrl = this;

  ctrl.emailFromName = (name, people=npolarPeople.people) => {

    let person = (people||[]).find(p => {
      return (`${p.first_name} ${p.last_name}`.toLowerCase() === name.toLowerCase());
    });

    if (person && person.email) {
      return person.email;
    } else {
      return name;
    }
  };

  ctrl.emailFromAlias = (alias, aliases=npolarAliases) => {
    let m = (aliases||[]).find(p => {
      return (p.alias && p.alias.includes(alias.toLowerCase())); // assumes aliases ARE already in lowercase
    });
    if (m && m.email) {
      return m.email;
    } else {
      return alias;
    }
  };

  $scope.security = NpolarApiSecurity;

  $scope.error = () => $scope._error;

  // After login: store user and JWT in local storage
  $scope.onLogin = function(response) {
    NpolarApiSecurity.setJwt(response.data.token);
    NpolarMessage.login(NpolarApiSecurity.getUser());
  };

  $scope.onLoginError = function(response) {
    $route.reload();
  };

  // Login (using username and password)
  $scope.login = function(email, password) {
    // Login using real name
    if (!(/@/).test(email)) {
      if ((/\s/).test(email)) {
        email = ctrl.emailFromName(email);
      } else {
        email = ctrl.emailFromAlias(email);
      }
    }
    console.log('after', email);
    Gouncer.authenticate(email, password).then($scope.onLogin, $scope.onLoginError);
  };

  $scope.logout = function() {
    NpolarApiSecurity.logout();
    //$route.reload();
  };

}

module.exports = LoginController;