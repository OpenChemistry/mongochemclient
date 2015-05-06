angular.module('chemPhyWebApp')
    .directive('chemPhyWebMain', [function() {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChemWeb Application";
            },
            templateUrl:  require('./main.view.jade')
        };
    }]);
