require('style/upload.styl');
require('./upload-area.directive.js');

angular.module('mongochemApp')
    .controller('mongochemUploadDialogController',
        function ($scope, $mdDialog) {
          $scope.hide = function() {
              $mdDialog.hide();          };
          $scope.cancel = function() {
              $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
              $mdDialog.hide(answer);
          };
    });