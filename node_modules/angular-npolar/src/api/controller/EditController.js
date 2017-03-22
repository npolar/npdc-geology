'use strict';
/**
 * NpolarEditController extends [NpolarBaseController](https://github.com/npolar/angular-npolar/blob/master/src/api/controller/BaseController.js) with scope methods for REST-style document editing (using ngResource)
 * and [formula](https://github.com/npolar/formula)-bound controller action methods, like $scope.edit()
 *
 * For following ngResource-bound scope methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 *
 * Usage example: https://github.com/npolar/npdc-dataset/blob/ae0dc74d33708c76ac88fc8f0f492ac14759cae7/src/edit/DatasetEditController.js
 *
 */

let EditController = function($scope, $location, $route, $routeParams, $controller, $q,
  Gouncer, npolarApiConfig, NpolarApiSecurity, NpolarMessage) {
    'ngInject';

  // Extend NpolarBaseController
  $controller('NpolarBaseController', {
    $scope: $scope
  });

  $scope.document = null;

  // Refresh JWT
  let refreshJwt = function() {
    if (NpolarApiSecurity.isAuthenticated()) {
      Gouncer.authenticate().then(function(response) {
        NpolarApiSecurity.setJwt(response.data.token);
      }, function (reason) {
        NpolarApiSecurity.logout("Authentication failed: could not refresh JWT");
      });
    }
  };

  // Formula compatible save
  // SHOULD NOT BE CALLED DIRECTLY, FORMULA DOES THE VALIDATION!!
  let save = function (model) {
    if (!model._rev) {
      return $scope.create(model);
    } else {
      return $scope.update(model);
    }
  };

  // Create action, ie. save document and redirect to new URI
  $scope.create = function(model) {
    return $scope.resource.save(model, function(doc) {
      let uri = $location.path().replace(/\/__new(\/edit)?$/, '/' + doc.id + '/edit');
      $scope.formula.setModel(doc);
      $scope.document = doc;
      $scope.resource.cache.removeAll();
      refreshJwt();
      $location.path(uri);
    });
  };

  // Edit action, ie. fetch document and edit with formula
  $scope.editAction = function() {
    return $scope.resource.fetch($routeParams, function(doc) {
      $scope.formula.setModel(doc);
      $scope.document = doc;
    });
  };

  // New action, ie. create new document and edit with formula
  // New document templates may be provided as an argument,
  // otherwise the create() function on the resource is called
  $scope.newAction = function(doc={}) {
    let deferred = $q.defer();
    if (Object.keys(doc).length === 0) {
      if (typeof $scope.resource.create === "function") {
        doc = $scope.resource.create();
      }
    }
    let resource = new $scope.resource(doc);
    $scope.document = resource;
    $scope.formula.setModel(resource);
    deferred.resolve(resource);
    resource.$promise = deferred.promise; // for consistency with editAction
    return resource;
  };

  // Edit (or new) action
  $scope.edit = function() {
    $scope.formula.setOnSave(save);

    if ($routeParams.id === '__new') {
      return $scope.newAction();
    } else {
      return $scope.editAction();
    }
  };

  // PUT document, ie resource.update
  $scope.update = function(model) {
    return $scope.resource.update(model, function(doc) {
      $scope.resource.cache.removeAll();
      refreshJwt();
      $location.path($scope.resource.href(doc.id));
    });
  };

  // DELETE document, ie. resource remove
  $scope.delete = function() {
    let id = $scope.document.id;
    return $scope.resource.remove({id}, function() {
      $scope.resource.cache.removeAll();
      refreshJwt();
      $location.path('/');
      $route.reload();
    });
  };

  // Create a duplicate of the current document
  $scope.duplicate = function(d = $scope.document, save=false, removeFields=["_id","_rev","created","created_by","id","updated","updated_by", "doi"]) {
    let dup = JSON.parse(JSON.stringify(d));
    let href = $scope.resource.href(d.id);

    removeFields.forEach(del => {
      delete dup[del];
    });
    if (dup.title) {
      if (typeof(dup.title) === 'string') {
        dup.title = `|${dup.title}|⇠${href}`;
      } else if (dup.title instanceof Object) {
        let k = Object.keys(dup.title);
        k.forEach(language => {
          dup.title[language] = `|${dup.title[language]}|⇠${href}`;
        });
      }
    }
    let duplicate = new $scope.resource(dup);

    if (save === true) {
      NpolarMessage.info(`Commencing duplication of ${d.id}`);
      return duplicate.$save((r) => {
        $location.path($scope.resource.href(r.id));
      });
    } else {
      return duplicate;
    }
  };

  $scope.save = function () {
    try {
      $scope.formula.save();
    } catch (e) {
      NpolarMessage.error("Document not valid, please review " + (e || []).join(", "));
    }
  };

};

module.exports = EditController;
