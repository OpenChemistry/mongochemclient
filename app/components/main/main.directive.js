var angular = require('angular')

angular.module('chemPhyWebApp')
    .directive('chemPhyWebMain', ['$log', function($log) {

        return {
            controller: function($scope) {
                $scope.message = "Welcome to Chemical-Physics Web!"
            },
            templateUrl: require('./main.view.html')
        }

    }]);