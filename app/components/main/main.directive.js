
angular.module('mongochemApp')
.directive('mongochemMain', [ '$log',
                              '$state',
                              '$window',
                              'mongochem.AuthenticationService',
                              'mongochem.GravatarService',
                              'mongochem.girder.User',
    function($log, $state, $window, authService, gravatarService, user) {
        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChemWeb";

                $scope.showLogin = function(evt) {
                    authService.authenticate($window.location.href, evt);
                };

                $scope.isLoggedIn = function() {
                    return authService.hasToken();
                };

                $scope.logout = function() {
                    authService.invalidateToken().then(function() {
                        $state.go('home');
                    });
                };

                $scope.goTo = function(state) {
                    $state.go(state);
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
