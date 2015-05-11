
angular.module('mongochemApp')
.directive('mongochemMain', [ '$log',
                              '$state',
                              'mongochem.AuthenticationService',
                              'mongochem.GravatarService',
                              'mongochem.girder.User',
    function($log, $state, authService, gravatarService, user) {
        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChemWeb";

                $scope.showLogin = function(evt) {
                    authService.authenticate(evt);
                };

                $scope.isLoggedIn = function() {
                    return authService.hasToken();
                };

                $scope.logout = function() {
                    authService.invalidateToken().then(function() {
                        $state.go('home');
                    });
                };

                user.get().$promise.then(function(user) {
                    $scope.gravatarUrl = gravatarService.gravatarUrl(user.email);
                    $scope.userName = `${user.firstName} ${user.lastName}`;
                },
                function(error) {
                    $log.error(error);
                });
            },
            templateUrl:  require('./main.view.jade')
        };
    }]);
