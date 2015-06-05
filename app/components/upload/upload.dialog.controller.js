require('style/upload.styl');
require('./upload-area.directive.js');

angular.module('mongochemApp')
    .controller('mongochem.UploadDialogController', ['$timeout', '$log', '$scope', '$mdDialog', '$http',
                                                     '$mdToast', 'mongochem.MoleculeFileUploadService',
                                                     'mongochem.Molecule',
        function ($timeout, $log, $scope, $mdDialog, $http, $mdToast,
                  uploadService, Molecule) {

          $scope.xyz = null;
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
              Molecule.create({}, {fileId: $scope.fileId}).$promise.then(function() {
                  $mdToast.show(
                          $mdToast.simple()
                              .content('Molecule successfully upload.')
                              .position('bottom right'));
              }, function(error) {
                  $mdToast.show(
                          $mdToast.simple()
                              .content(error.data.message)
                              .position('top right'));
              });

              $mdDialog.hide();
          };

          $scope.uploadFile = function(file) {
              uploadService.upload(file).then(function(id) {
                  $scope.fileId = id;

                  $http.post('api/v1/molecules/conversions/xyz', {fileId: id}).then(function(xyz) {
                      $scope.xyz = xyz.data;
                      $scope.title = $scope.previewTitle;
                  }, function(error) {
                      $mdToast.show(
                              $mdToast.simple()
                                  .content(error.data.message)
                                  .position('top right'));
                  });
              },function(error) {
                  $mdToast.show(
                          $mdToast.simple()
                              .content(error.data.message)
                              .position('top right'));
              });
          };

          $scope.showPreview = function() {
              return !!$scope.xyz;
          };

          $scope.startOver = function() {
              $scope.xyz = null;
              $scope.title = $scope.uploadTitle;
              $scope.drop = false;
          }
    }]);
