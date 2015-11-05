var uploadDialogUrl = require('../upload/upload.dialog.jade');

angular.module('mongochemApp')
    .directive('mongochemSide', ['$state',
                                 'mongochem.AuthenticationService',
                                 function($state, authService) {

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
                        controller: 'mongochem.UploadDialogController',
                        templateUrl: uploadDialogUrl,
                        targetEvent: e,
                        clickOutsideToClose: true
                    });
                };
            },
            link: function() {


            },
            templateUrl: require('./side.view.jade')
        };
    }]);
