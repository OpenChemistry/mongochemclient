angular.module('chemPhyWebApp')
    .directive('chemPhyWebMain', [function() {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChem";
            },
            templateUrl:  require('./main.view.jade')
        };
    }]);
