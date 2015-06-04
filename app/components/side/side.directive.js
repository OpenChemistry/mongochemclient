var uploadDialogUrl = require('../upload/upload.dialog.jade')

//function UploadController($scope, $mdDialog) {
//    $scope.hide = function() {
//      $mdDialog.hide();          };
//    $scope.cancel = function() {
//      $mdDialog.cancel();
//    };
//    $scope.answer = function(answer) {
//      $mdDialog.hide(answer);
//    };
//}

angular.module('mongochemApp')
    .directive('mongochemSide', ['$state',
                                 'mongochem.AuthenticationService',
                                 'mongochem.MoleculeFileUploadService',
                                 function($state, authService, uploadService) {

        return {
            controller: function($scope, $mdDialog) {
                $scope.items = [
                  {'name': 'Home',
                   'state': 'home'},
                  {'name': 'About',
                   'state': 'about'}
                ];

                $scope.allowUpload = function() {
                    return authService.hasToken();
                };

                $scope.showUploadDialog = function(e) {
                    $mdDialog.show({
                        controller: 'mongochemUploadDialogController',
                        templateUrl: uploadDialogUrl,
                        targetEvent: e,
                    });
//                    $mdDialog.show(
//                        $mdDialog.alert()
//                        .parent(angular.element(document.body))
//                        .title('This is an alert title')
//                        .content('You can specify some description text in here.')
//                        .ariaLabel('Alert Dialog Demo')
//                        .ok('Got it!')
//                        .targetEvent(e)
//                   );
                };
            },
            link: function() {


            },
            templateUrl: require('./side.view.jade')
        };
    }]);
