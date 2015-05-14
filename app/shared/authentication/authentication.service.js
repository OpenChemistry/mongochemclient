var loginTemplate = require('../../components/login/login.dialog.jade');

angular.module('mongochem.services')
    .factory('mongochem.girder.User', function($resource) {
        return $resource('api/v1/user/me');
    })
    .factory('mongochem.girder.Session', function($resource) {
        return $resource('api/v1/token/session');
    })
    .factory('mongochem.girder.Item', function($resource) {
        return $resource('api/v1/item');
    })
    .config(function($httpProvider) {
                 $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
                    var authService, $http, $state;

                    // Prevent `Uncaught Error: [$injector:cdep] Circular dependency found`
                    $timeout(function () {
                        authService = $injector.get('mongochem.AuthenticationService');
                        $http = $injector.get('$http');
                        $state = $injector.get('$state');
                    });

                     return {
                         responseError: function (rejection) {

                             var deferred = $q.deferred;

                             if (rejection.status !== 401) {
                                 return rejection;
                             }

                             authService.authenticate($state.current.url);

                             // Provide resoved promise ( we are going to be
                             // redirected anyway.
                             deferred.resolve({});

                             return deferred.promise;
                         }
                     };
                 });
        })
    .service('mongochem.AuthenticationService', ['$q', '$mdDialog', '$cookies',
                                                 '$log', 'mongochem.girder.User',
                                                 'mongochem.girder.Session',
        function($q, $mdDialog, $cookies, $log, user, session) {

        this.isAuthenticated = function() {
            var deferred = $q.defer();

            user.get({}).$promise.then(
                    function(result) {
                        if (Object.keys(result.toJSON()).length === 0) {
                            deferred.resolve(false);
                        }
                        else {
                            deferred.resolve(true);
                        }
                    },
                    function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise;
        };

        this.hasToken = function() {
            return 'girderToken' in $cookies;
        };

        this.authenticate = function(redirectUrl, evt) {
            $mdDialog.show({
                locals: {
                    redirectUrl: redirectUrl
                },
                controller: 'mongochem.LoginDialogController',
                templateUrl: loginTemplate,
                targetEvent: evt
            });
        };

        this.invalidateToken = function() {
            var deferred = $q.defer();

            session.delete().$promise.then(function() {
                delete $cookies.girderToken;
                deferred.resolve();

            },
            function(error) {
                $log.error(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
    }]);
