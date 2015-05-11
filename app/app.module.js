var angular = require('angular');
require('angular-aria');
require('angular-resource');
require('angular-animate');
require('angular-cookies');
require('angular-material');
require('angular-material/angular-material.css');
require('style/common.styl');
require('angular-material-icons');
require('./app.services.js');


angular.module('mongochemApp', [require('angular-ui-router'), 'ngMaterial', 'ngMdIcons', 'mongochem.services',
                                'ngCookies'])
  .run(['$rootScope', '$log', '$state', 'mongochem.AuthenticationService',
        function ($rootScope, $log, $state,  AuthService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireAuth = toState.data ? toState.data.requireAuth : false;

        if (requireAuth) {
            event.preventDefault();
            AuthService.isAuthenticated().then(
                    function(isAuthenticated) {
                        if (!isAuthenticated) {
                            AuthService.authenticate();
                        }
                        else {
                            $state.go(toState.name, toParams, {notify: false});
                        }
                    },
                    function(error) {
                        $log.error(error);
                    });

            console.log('Login required ...');
        }
    });

  }])
  .config(function($httpProvider) {
      $httpProvider.defaults.xsrfCookieName = 'girderToken';
      $httpProvider.defaults.xsrfHeaderName = 'Girder-Token';
  });

