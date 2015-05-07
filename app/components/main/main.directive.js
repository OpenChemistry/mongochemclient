angular.module('mongochemApp')
    .directive('mongochemMain', [function() {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MongoChem";
            },
            templateUrl:  require('./main.view.jade')
        };
    }]);
