require('style/upload.styl');
require('./upload-area.directive.js');

angular.module('mongochemApp')
    .controller('mongochem.MoleculeWatchScope', ['Molecules', '$scope', function(Molecules, $scope) {
        $scope.$watch('xyz', function(newVal) {

            if (!$scope.viewer) {
                return;
            }
            $scope.viewer.clear();
            $scope.viewer.resize();
            $scope.viewer.addModel(newVal, 'xyz');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });

        $scope.$watch('sdf', function(newVal) {

            if (!$scope.viewer) {
                return;
            }
            $scope.viewer.clear();
            $scope.viewer.resize();
            $scope.viewer.addModel(newVal, 'sdf');
            $scope.viewer.setStyle({}, {stick:{}});
            $scope.viewer.zoomTo();
            $scope.viewer.render();
        });
    }])
    .controller('mongochem.UploadDialogController', ['$q', '$timeout', '$log', '$scope', '$mdDialog', '$http',
                                                     '$mdToast', '$rootScope', 'mongochem.MoleculeFileUploadService',
                                                     'mongochem.Molecule',
        function ($q, $timeout, $log, $scope, $mdDialog, $http, $mdToast, $rootScope,
                  uploadService, Molecule) {

          $scope.xyz = null;
          $scope.sdf = null;
          $scope.uploadTitle = 'Upload molecular data';
          $scope.previewTitle = 'Preview molecular structure';
          $scope.title = $scope.uploadTitle;

          $scope.hide = function() {
              $mdDialog.hide();
          };

          $scope.cancel = function() {
              $mdDialog.cancel();
          };

          $scope.upload = function() {

              if ($scope.newMolecule) {
                  Molecule.create({}, {fileId: $scope.fileId}).$promise.then(function() {
                      $mdToast.show(
                              $mdToast.simple()
                                  .content('Molecule successfully upload.')
                                  .position('bottom right'));
                      $rootScope.$broadcast('mongochem-molecule-created');
                  }, function(error) {
                      $mdToast.show(
                              $mdToast.simple()
                                  .content(error.data.message)
                                  .position('top right'));
                  });
              }
              else {
                  // TODO append file to molecule?
              }

              $mdDialog.hide();
          };

          function fetchMolecule(fileId) {

              var deferred = $q.defer();

              $http.post('api/v1/molecules/conversions/inchikey', {fileId: fileId}).then(function(inchikey) {
                  return Molecule.getByInchiKey({moleculeId: inchikey.data}).$promise;
              }, function(error) {
                  deferred.reject(error);
              }).then(function(molecule) {
                  return deferred.resolve(molecule);
              }, function(error) {
                  deferred.reject(error);
              });

              return deferred.promise;
          }

          $scope.uploadFile = function(file) {
              uploadService.upload(file).then(function(id) {
                  $scope.fileId = id;
                  $scope.newMolecule = false;

                  (function() {
                      if (file.name.match(/^.*\.cml$/)) {
                          return $http.post('api/v1/molecules/conversions/sdf', {fileId: id}).then(function(sdf) {
                              $scope.sdf = sdf.data;
                              $scope.title = $scope.previewTitle;

                              return fetchMolecule(id);
                          },
                          function(error) {
                              $mdToast.show(
                                      $mdToast.simple()
                                          .content(error.data.message)
                                          .position('top right'));
                              $scope.error = true;
                          });
                      }
                      else {
                          return $http.post('api/v1/molecules/conversions/xyz', {fileId: id}).then(function(xyz) {
                              $scope.xyz = xyz.data;
                              $scope.title = $scope.previewTitle;

                              return fetchMolecule(id);
                          },
                          function(error) {
                              $mdToast.show(
                                      $mdToast.simple()
                                          .content(error.data.message)
                                          .position('top right'));
                              $scope.error = true;
                          });
                      }
                  })().then(function() {

                      // Add to existing entry
                      $scope.message = 'A molecule with this structure already exists.' +
                                       'Your data will be added to this entry.';

                      // TODO add to existing entry in some way ...

                  }, function(error) {

                      if (error.status === 404) {
                          // Create new molecule
                          $scope.message = 'No molecules with this structure exist. Uploading ' +
                                           'this file will result in the creation of a new ' +
                                           'molecule entry.';

                          $scope.newMolecule = true;
                      }
                      else {
                          $mdToast.show(
                                  $mdToast.simple()
                                      .content(error.data.message)
                                      .position('top right'));
                          $scope.error = true;
                      }
                  });

              },function(error) {
                  $mdToast.show(
                          $mdToast.simple()
                              .content(error.data.message)
                              .position('top right'));
                  $scope.error = true;
              });
          };

          $scope.showPreview = function() {
              return !!$scope.xyz || !!$scope.sdf;
          };

          $scope.startOver = function() {
              $scope.xyz = null;
              $scope.title = $scope.uploadTitle;
              $scope.drop = false;
              $scope.message = '';
              $scope.error = false;
          };
    }]);
