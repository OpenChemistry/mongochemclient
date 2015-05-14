require('style/login.styl');

angular.module('mongochemApp')
    .controller('mongochem.LoginDialogController', ['$scope', '$window', 'mongochem.OAuthProvider', 'redirectUrl',
        function($scope, $window, OAuthProvider, redirectUrl) {
        $scope.redirect = function(providerUrl) {
            console.log('test');
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
