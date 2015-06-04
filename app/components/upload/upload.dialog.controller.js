require('style/upload.styl');
require('./upload-area.directive.js');

angular.module('mongochemApp')
    .controller('mongochemUploadDialogController', [ '$timeout', '$log', '$scope', '$mdDialog', '$http',
                                                     'mongochem.MoleculeFileUploadService',
                                                     'mongochem.Molecule',
        function ($timeout, $log, $scope, $mdDialog, $http, uploadService, Molecule) {

          $scope.xyz = null;
          $scope.title = 'Upload molecular data'

          $scope.hide = function() {
              $mdDialog.hide();          };

          $scope.cancel = function() {
              $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
              $mdDialog.hide(answer);
          };

          $scope.uploadFile = function(file) {
              uploadService.upload(file).then(function(id) {
                  console.log(id);

                  $http.post('api/v1/molecules/conversions/xyz', {fileId: id}).then(function(xyz) {
                      $scope.xyz = xyz.data;
                      $scope.title = 'Preview of molecular structure'
                  }, function(error) {
                      $log.error(error);
                  });
              },function(error) {
                  $log.error(error);
              });
          };

          $scope.showPreview = function() {
              return !!$scope.xyz;
          };

          $scope.startOver = function() {
              $scope.xyz = null;
          }
    }]);
