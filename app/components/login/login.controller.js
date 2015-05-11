require('style/login.styl');

angular.module('mongochemApp')
    .controller('mongochem.LoginDialogController', ['$scope', '$window', 'mongochem.OAuthProvider',
        function($scope, $window, OAuthProvider) {
        $scope.redirect = function(providerUrl) {
            console.log('test');
            $window.location.href = providerUrl;
        };

        OAuthProvider.get({redirect: $window.location.href}).$promise.then(
                function(providers) {
                    $scope.providers = providers;
                },
                function(error) {
                    $log.error(error);
                });
    }]);
