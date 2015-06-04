require('style/upload.styl');
require('./upload-area.directive.js');

angular.module('mongochemApp')
    .controller('mongochemUploadDialogController', [ '$log', '$scope', '$mdDialog', '$http',
                                                     'mongochem.MoleculeFileUploadService',
                                                     'mongochem.Molecule',
        function ($log, $scope, $mdDialog, $http, uploadService, Molecule) {
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
                      console.log(xyz);
                  }, function(error) {
                      $log.error(error);
                  });
              },function(error) {
                  $log.error(error);
              });
          };
    }]);
