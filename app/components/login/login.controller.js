require('style/login.styl');

angular.module('mongochemApp')
    .controller('mongochem.LoginDialogController', ['$log', '$scope', '$window', 'mongochem.OAuthProvider', 'redirectUrl',
        function($log, $scope, $window, OAuthProvider, redirectUrl) {
        $scope.redirect = function(providerUrl) {
            $window.location.href = providerUrl;
        };

        OAuthProvider.get({redirect: redirectUrl}).$promise.then(
                function(providers) {
                    $scope.providers = providers;
                },
                function(error) {
                    $log.error(error);
                });
    }]);
