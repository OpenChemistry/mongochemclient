var angular = require('angular')

angular.module('chemPhyWebApp')
    .directive('chemPhyWebMain', ['$log', function($log) {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChemWeb Application"
            },
            templateUrl: require('./main.view.html')
        }

    }]);
