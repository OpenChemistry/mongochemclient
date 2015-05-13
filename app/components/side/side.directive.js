angular.module('mongochemApp')
    .directive('mongochemSide', ['$state',
                                 'mongochem.AuthenticationService',
                                 'mongochem.MoleculeFileUploadService',
                                 function($state, authService, uploadService) {

        return {
            controller: function($scope) {
                $scope.message = "MCW Sidebar";
                $scope.items = [
                  {'name': 'Home',
                   'state': 'home'},
                  {'name': 'About',
                   'state': 'about'}
                ];

                $scope.allowUpload = function() {
                    return authService.hasToken() && $state.current.name === 'molecule';
                };
            },
            link: function() {
                // Little bit of hackery to get the filebrowser to come up
                var input = document.getElementById('mongochem-file-upload');
                document.getElementById('mongochem-launch-filebrowser').onclick = function() {
                    input.click();
                };

                input.onchange = function(evt) {
                    let files = evt.target.files;

                    if (files.length !== 0) {
                        uploadService.upload(files);
                    }
                };
            },
            templateUrl: require('./side.view.jade')
        };
    }]);
