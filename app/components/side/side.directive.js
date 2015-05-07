angular.module('chemPhyWebApp')
    .directive('chemPhyWebSide', [function() {

        return {
            scope: {},
            controller: function($scope) {
                $scope.message = "MCW Sidebar";
                $scope.items = [
                  {'name': 'Home',
                   'state': 'home'},
                  {'name': 'About',
                   'state': 'about'}
                ];
            },
            templateUrl: require('./side.view.jade')
        };
    }]);
