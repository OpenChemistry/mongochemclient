var templateUrl = require('./main.view.jade')

angular.module('chemPhyWebApp')
    .directive('chemPhyWebMain', ['$log', function($log) {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChemWeb Application"
            },
            templateUrl:  templateUrl
        }
    }]);
